from datetime import datetime
import os

from flask import Flask, jsonify, request
from pymongo import ASCENDING, MongoClient
from pymongo.errors import DuplicateKeyError


app = Flask(__name__)

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://root:example@mongodb:27017/insurance_reviewer?authSource=admin",
)
DB_NAME = os.getenv("MONGODB_DB", "insurance_reviewer")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users = db["users"]
users.create_index([("email", ASCENDING)], unique=True)
questions = db["questions"]
questions.create_index([("id", ASCENDING)], unique=True)


# Initialize with sample questions if empty
def init_questions():
    if questions.count_documents({}) == 0:
        sample_q = {
            "id": 15,
            "domain": "General Insurance Principles",
            "text": "What is the primary purpose of subrogation in insurance?",
            "type": "MULTIPLE CHOICE",
            "options": [
                {
                    "id": "A",
                    "text": "To allow the insurer to deny claims for negligence.",
                    "isCorrect": False,
                    "explanation": "Incorrect. Subrogation is not about denying claims; it's about the insurer's right to recover paid claim costs from the responsible third party."
                },
                {
                    "id": "B",
                    "text": "To provide a method for the insurer to increase annual premium rates.",
                    "isCorrect": False,
                    "explanation": "Incorrect. Subrogation prevents the insured from collecting twice for the same loss. It is the legal process by which an insurance company seeks recovery of the amount paid to the insured from a third party who is responsible for the loss. It is not a mechanism for rate hikes."
                },
                {
                    "id": "C",
                    "text": "To prevent the insured from collecting twice for the same loss by transferring recovery rights to the insurer.",
                    "isCorrect": True,
                    "explanation": "Correct! This is the principle of indemnity in action. Subrogation ensures the policyholder is made whole but does not profit from a loss by collecting from both the insurer and the at-fault party."
                },
                {
                    "id": "D",
                    "text": "To ensure that all policyholders pay the same deductible regardless of risk.",
                    "isCorrect": False,
                    "explanation": "Incorrect. Deductibles are unrelated to subrogation. Subrogation deals with post-claim recovery from third parties."
                }
            ]
        }
        questions.insert_one(sample_q)
        print("✓ Sample question initialized")


# Call init_questions immediately on app startup (works with both gunicorn and direct run)
init_questions()


@app.get("/api/health")
def health():
    return jsonify({"status": "Backend is running"})


@app.post("/api/register")
def register():
    payload = request.get_json(silent=True) or {}

    full_name = (payload.get("fullName") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""
    confirm_password = payload.get("confirmPassword") or ""

    if not full_name or not email or not password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400

    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    try:
        result = users.insert_one(
            {
                "fullName": full_name,
                "email": email,
                "password": password,
                "is_admin": False,
                "createdAt": datetime.utcnow(),
            }
        )
    except DuplicateKeyError:
        return jsonify({"error": "Email already registered"}), 409
    except Exception:
        return jsonify({"error": "Registration failed"}), 500

    return (
        jsonify(
            {
                "message": "User registered successfully",
                "user": {
                    "id": str(result.inserted_id),
                    "fullName": full_name,
                    "email": email,
                },
            }
        ),
        201,
    )


@app.post("/api/login")
def login():
    payload = request.get_json(silent=True) or {}

    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users.find_one({"email": email})

    if not user or user.get("password") != password:
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": str(user["_id"]),
            "fullName": user.get("fullName", ""),
            "email": user["email"],
            "isAdmin": bool(user.get("is_admin", False)),
        },
    })


@app.get("/api/questions")
def get_questions():
    """Fetch all questions from the database."""
    try:
        all_questions = list(questions.find({}, {"_id": 0}))
        return jsonify({"questions": all_questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/api/questions/<int:question_id>")
def get_question(question_id: int):
    """Fetch a specific question by ID."""
    try:
        question = questions.find_one({"id": question_id}, {"_id": 0})
        if not question:
            return jsonify({"error": "Question not found"}), 404
        return jsonify(question)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
