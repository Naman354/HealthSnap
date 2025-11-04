# 🩺 HealthSnap

HealthSnap is a smart health tracking platform designed to help users monitor their daily lifestyle habits, analyze health symptoms, and receive intelligent health predictions powered by machine learning models.  

It enables users to log daily inputs such as sleep, hydration, stress levels, and symptoms — and receive instant feedback and predictions from integrated ML models.  

---

## 🚀 Features

### 🔐 Authentication & Security
- Secure user registration and login using JWT authentication.  
- Email verification and password reset powered by **SendGrid**.  
- Single Sender Verification implemented (ready for Domain Authentication upgrade).

### 🧠 Machine Learning Integration
- Seamless integration with ML models hosted on **Render** for health predictions.  
- Data preprocessing handled in Node.js backend before sending to the Python Flask/FastAPI services.  
- JSON-based request/response for clean API communication.

### 💾 Core Functionalities
- Save and manage **daily health and symptom data**.  
- **ML predictions** for health improvement or risk estimation.  
- **Profile management**, including user deletion.  
- **Reminders system** to schedule recurring or weekly in-app health tasks.

### 🔔 Reminders
- Users can create, view, and delete personalized health reminders (e.g., “Go for a walk every Monday at 8 AM”).  
- Basic in-app reminder support (backend routes ready for future notification expansion).

---


## 📮Postman API Documentation : [https://documenter.getpostman.com/view/48451096/2sB3WmUi98#e8c85166-b9cc-441e-8e5b-37eb522bc2e1]

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Flutter |
| **Backend** | Node.js (Express.js) |
| **Database** | MongoDB (Mongoose ORM) |
| **Email Service** | SendGrid |
| **ML Models** | Flask / FastAPI hosted on Render |
| **Hosting** | Render |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/<your-username>/HealthSnap-backend.git
cd HealthSnap-backend
npm install
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
SENDGRID_API_KEY=<your_sendgrid_api_key>
EMAIL_FROM=<your_verified_sender_email>
npm start
http://localhost:5500/
| Route                             | Method | Description                                       |
| --------------------------------- | ------ | ------------------------------------------------- |
| `/api/auth/register`              | POST   | Register a new user                               |
| `/api/auth/login`                 | POST   | Login and get token                               |
| `/api/auth/verify-email/:token`   | GET    | Verify user email                                 |
| `/api/auth/forgot-password`       | POST   | Send password reset link                          |
| `/api/auth/reset-password/:token` | POST   | Reset password                                    |
| `/api/profile`                    | POST   | Save profile & symptom data and send to ML models |
| `/api/reminders/create`           | POST   | Create a new reminder                             |
| `/api/reminders`                  | GET    | Get all reminders for logged-in user              |
| `/api/reminders/:id`              | DELETE | Delete a reminder                                 |
| `/api/user/delete`                | DELETE | Delete user account                               |

Example ML Integration Response
{
  "success": true,
  "message": "Symptom entry saved successfully",
  "data": {
    "entry": {
      "name": "Naman",
      "gender": "Male",
      "DOB": "2000-05-20",
      "sleep_quality": "Normal",
      "hydration_level": "Normal",
      "stress_level": "Low"
    },
    "mlPrediction": {
      "confidence": 0.95,
      "prediction": "improving"
    }
  }
}
“Monitor smart. Live healthier. Predict better.” — HealthSnap Team

