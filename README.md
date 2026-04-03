<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/7df6de92-9c58-4595-ba69-73d09d737d24

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Run with Docker Compose + MongoDB

1. Build and start services:
   `docker compose up --build -d`
2. Open the app:
   Front-end: `http://localhost:3100`
   API: `http://localhost:5100`
3. Stop services:
   `docker compose down`

### Test Registration

- Navigate to `/register` on the frontend
- Fill out the form and click "Create Free Account"
- User data is saved to MongoDB
- Navigate to `/login` to log in

### API Endpoints

- **POST /api/register** - Register a new user
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **GET /api/health** - Check API status

MongoDB connection details in this setup:

- Host: `mongodb`
- Port: `27017` (internal Docker network)
- Database: `insurance_reviewer`
- Username: `root`
- Password: `example`
- URI: `mongodb://root:example@mongodb:27017/insurance_reviewer?authSource=admin`

Note: MongoDB is not published to your host port by default to avoid conflicts with existing local databases.

To remove MongoDB data volume as well:
`docker compose down -v`
