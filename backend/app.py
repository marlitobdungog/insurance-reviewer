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


STARTER_QUESTIONS = [
    {
        "id": 15,
        "domain": "General Insurance Principles",
        "text": "What is the primary purpose of subrogation in insurance?",
        "type": "MULTIPLE CHOICE",
        "options": [
            {
                "id": "A",
                "text": "To allow the insurer to deny claims for negligence.",
                "isCorrect": False,
                "explanation": "Incorrect. Subrogation is not about denying claims; it's about the insurer's right to recover paid claim costs from the responsible third party.",
            },
            {
                "id": "B",
                "text": "To provide a method for the insurer to increase annual premium rates.",
                "isCorrect": False,
                "explanation": "Incorrect. Subrogation prevents the insured from collecting twice for the same loss. It is the legal process by which an insurance company seeks recovery of the amount paid to the insured from a third party who is responsible for the loss. It is not a mechanism for rate hikes.",
            },
            {
                "id": "C",
                "text": "To prevent the insured from collecting twice for the same loss by transferring recovery rights to the insurer.",
                "isCorrect": True,
                "explanation": "Correct! This is the principle of indemnity in action. Subrogation ensures the policyholder is made whole but does not profit from a loss by collecting from both the insurer and the at-fault party.",
            },
            {
                "id": "D",
                "text": "To ensure that all policyholders pay the same deductible regardless of risk.",
                "isCorrect": False,
                "explanation": "Incorrect. Deductibles are unrelated to subrogation. Subrogation deals with post-claim recovery from third parties.",
            },
        ],
    },
    {
        "id": 16,
        "domain": "Contract Law",
        "text": "Which of the following best describes a contract of adhesion?",
        "type": "MULTIPLE CHOICE",
        "options": [
            {
                "id": "A",
                "text": "A contract negotiated between two equal parties.",
                "isCorrect": False,
                "explanation": "Incorrect. A contract of adhesion is not negotiated on equal terms.",
            },
            {
                "id": "B",
                "text": "A contract prepared by one party and submitted to the other on a take-it-or-leave-it basis.",
                "isCorrect": True,
                "explanation": "Correct! Insurance policies are commonly contracts of adhesion because the insurer drafts the contract and the applicant accepts or rejects it as written.",
            },
            {
                "id": "C",
                "text": "A contract that can be cancelled at any time.",
                "isCorrect": False,
                "explanation": "Incorrect. Cancellation rights do not define a contract of adhesion.",
            },
            {
                "id": "D",
                "text": "A contract involving illegal activities.",
                "isCorrect": False,
                "explanation": "Incorrect. Illegal subject matter makes a contract unenforceable, not adhesive.",
            },
        ],
    },
    {
        "id": 17,
        "domain": "Financial Regs",
        "text": "An insurer is considered solvent if it has enough assets to cover its liabilities and reinsurance.",
        "type": "TRUE/FALSE",
        "options": [
            {
                "id": "A",
                "text": "True",
                "isCorrect": True,
                "explanation": "Correct! Solvency refers to the insurer's ability to meet its financial obligations.",
            },
            {
                "id": "B",
                "text": "False",
                "isCorrect": False,
                "explanation": "Incorrect. An insurer is considered solvent when its assets are sufficient to cover liabilities.",
            },
        ],
    },
    {
        "id": 18,
        "domain": "State Law",
        "text": "What is the maximum penalty for a willful violation of the Insurance Code?",
        "type": "MULTIPLE CHOICE",
        "options": [
            {
                "id": "A",
                "text": "$1,000",
                "isCorrect": False,
                "explanation": "Incorrect. The maximum penalty for a willful violation is higher than this amount.",
            },
            {
                "id": "B",
                "text": "$5,000",
                "isCorrect": False,
                "explanation": "Incorrect. This is not the maximum penalty in the referenced code section.",
            },
            {
                "id": "C",
                "text": "$10,000",
                "isCorrect": False,
                "explanation": "Incorrect. This amount is below the maximum penalty for a willful violation.",
            },
            {
                "id": "D",
                "text": "$25,000",
                "isCorrect": True,
                "explanation": "Correct! The maximum penalty for a willful violation can be $25,000.",
            },
        ],
    },
    {
        "id": 19,
        "domain": "General Insurance",
        "text": "Risk retention groups are primarily formed to provide which type of insurance?",
        "type": "MULTIPLE CHOICE",
        "options": [
            {
                "id": "A",
                "text": "Life Insurance",
                "isCorrect": False,
                "explanation": "Incorrect. Risk retention groups are not primarily used for life insurance.",
            },
            {
                "id": "B",
                "text": "Liability Insurance",
                "isCorrect": True,
                "explanation": "Correct! Risk retention groups are generally formed to provide liability insurance coverage to their members.",
            },
            {
                "id": "C",
                "text": "Health Insurance",
                "isCorrect": False,
                "explanation": "Incorrect. Health insurance is not the primary purpose of risk retention groups.",
            },
            {
                "id": "D",
                "text": "Property Insurance",
                "isCorrect": False,
                "explanation": "Incorrect. These groups are mainly organized for liability coverage.",
            },
        ],
    },
]


# Initialize with sample questions if empty
def init_questions():
    for starter_question in STARTER_QUESTIONS:
        questions.update_one(
            {"id": starter_question["id"]},
            {"$setOnInsert": starter_question},
            upsert=True,
        )


def serialize_question(document):
    return {
        "id": document["id"],
        "domain": document["domain"],
        "text": document["text"],
        "type": document["type"],
        "options": document["options"],
    }


def next_question_id():
    latest_question = questions.find_one(sort=[("id", -1)], projection={"id": 1, "_id": 0})
    return (latest_question["id"] if latest_question else 0) + 1


def validate_question(payload, *, existing_id=None):
    question_type = (payload.get("type") or "").strip().upper()
    domain = (payload.get("domain") or "").strip()
    text = (payload.get("text") or "").strip()
    raw_options = payload.get("options")

    if not domain or not text:
        return None, "Domain and question text are required"

    if question_type not in {"MULTIPLE CHOICE", "TRUE/FALSE"}:
        return None, "Question type must be MULTIPLE CHOICE or TRUE/FALSE"

    if not isinstance(raw_options, list) or len(raw_options) < 2:
        return None, "At least two answer options are required"

    normalized_options = []
    correct_count = 0

    for index, option in enumerate(raw_options):
        option_id = (option.get("id") or chr(65 + index)).strip().upper()
        option_text = (option.get("text") or "").strip()
        explanation = (option.get("explanation") or "").strip()
        is_correct = bool(option.get("isCorrect", False))

        if not option_text or not explanation:
            return None, "Each option needs text and an explanation"

        if is_correct:
            correct_count += 1

        normalized_options.append(
            {
                "id": option_id,
                "text": option_text,
                "isCorrect": is_correct,
                "explanation": explanation,
            }
        )

    if correct_count != 1:
        return None, "Exactly one option must be marked correct"

    raw_id = payload.get("id")
    question_id = existing_id if existing_id is not None else None

    if question_id is None and raw_id not in (None, ""):
        try:
            question_id = int(raw_id)
        except (TypeError, ValueError):
            return None, "Question ID must be a number"

    if question_id is None or question_id <= 0:
        question_id = next_question_id()

    normalized_question = {
        "id": question_id,
        "domain": domain,
        "text": text,
        "type": question_type,
        "options": normalized_options,
    }
    return normalized_question, None


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
    try:
        all_questions = [
            serialize_question(question)
            for question in questions.find({}, {"_id": 0}).sort("id", ASCENDING)
        ]
        return jsonify({"questions": all_questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.post("/api/questions")
def create_question():
    payload = request.get_json(silent=True) or {}
    question, error = validate_question(payload)

    if error:
        return jsonify({"error": error}), 400

    try:
        questions.insert_one(dict(question))
        return jsonify(question), 201
    except DuplicateKeyError:
        return jsonify({"error": "Question ID already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.get("/api/questions/<int:question_id>")
def get_question(question_id: int):
    try:
        question = questions.find_one({"id": question_id}, {"_id": 0})
        if not question:
            return jsonify({"error": "Question not found"}), 404
        return jsonify(serialize_question(question))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.put("/api/questions/<int:question_id>")
def update_question(question_id: int):
    existing_question = questions.find_one({"id": question_id}, {"_id": 0})
    if not existing_question:
        return jsonify({"error": "Question not found"}), 404

    payload = request.get_json(silent=True) or {}
    question, error = validate_question(payload, existing_id=question_id)

    if error:
        return jsonify({"error": error}), 400

    try:
        questions.update_one({"id": question_id}, {"$set": question})
        return jsonify(question)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.delete("/api/questions/<int:question_id>")
def delete_question(question_id: int):
    try:
        result = questions.delete_one({"id": question_id})
        if result.deleted_count == 0:
            return jsonify({"error": "Question not found"}), 404
        return jsonify({"message": "Question deleted"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
