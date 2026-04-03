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


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
