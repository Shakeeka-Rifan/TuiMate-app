# TuiMate – AI-powered Tuition Finder App

A mobile application that connects students with nearby tutors using AI-based
preference matching and GPS tracking. Built with React Native, Node.js,
MongoDB, and Firebase.

<p align="center">
  <img src="![Image](https://github.com/user-attachments/assets/9c56b813-53d3-4a15-b3a1-5f18118b11f7)" alt="TuiMate Get Started Screen" width="300"  height="200"/>
</p>





![Image](https://github.com/user-attachments/assets/cdbe12f1-645d-436e-8ef9-b8958c60c951)

🎯Overview

TuiMate is a mobile and web-based application designed to connect students with local tutors using AI-based matching and GPS location tracking.
It simplifies the process of finding qualified tutors based on subject preferences, class type, schedule, and location proximity.

🚀 Key Features

   📍 Location-Based Search: Find nearby tutors using GPS integration.

   🤖 AI Tutor Matching: Smart recommendations based on student preferences and learning style.

   ⏰ Smart Scheduling: Prevents class timing conflicts and detects overlaps automatically.

   🧑‍🏫 Tutor Verification: Admin approval system with email notifications for verified tutors.

   💬 Real-Time Communication: Students can send booking requests and receive status updates.

   🧠 Dashboard Insights: Personalized dashboard showing recommended tutors, classes, and learning progress.

   🔔 Notifications: In-app and email alerts for booking status and tutor approvals.

🧩 Tech Stack

Category	Technology
Frontend	React Native (Mobile App), React.js (Admin Panel)
Backend	Node.js, Express.js
Database	MongoDB Atlas
Authentication	JWT, Firebase
Other Tools	Nodemailer (Email), Expo Location API (Reverse Geolocation)
🗂️ Project Structure
TuiMate-app/
│
├── tui-mate-frontend/       # React Native app for students and tutors
├── tui-mate-backend/        # Node.js & Express.js backend
├── tui-mate-admin/          # React.js admin dashboard
├── package.json
└── README.md

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/Shakeeka-Rifan/TuiMate-app.git
cd TuiMate-app

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file inside tui-mate-backend/

4️⃣ Run the Backend
cd tui-mate-backend
npm start

5️⃣ Run the Frontend (Mobile)
cd tui-mate-frontend
npm start

6️⃣ Run the Admin Panel
cd tui-mate-admin
npm start

📱 Main Modules

Student Module: Signup/Login, Preference Form, AI-based Tutor Recommendations, Bookings, Dashboard.
Tutor Module: Signup/Login, Class Creation, Booking Management, Ratings & Reviews.
Admin Module: Tutor Approval, User Management, Analytics, Feedback Review.

🧮 AI Matching Logic

Uses student preferences (subject, class type, study time, and location).
Filters tutors with matching fields in MongoDB.
Returns ranked tutor recommendations with highest match scores.

🔒 Security

JWT-based authentication for secure access.
Tutor verification via admin approval before account activation.
Encrypted data transmission between frontend and backend.



🏆 Acknowledgments
Developed as part of the Final Year Project (University of Bedfordshire)
Special thanks to mentors and peers who provided feedback throughout development.


