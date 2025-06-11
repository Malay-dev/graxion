# 🚀 Graxion - AI-Based Assessment & Feedback Platform

Graxion is an intelligent platform designed to revolutionize how assessments are created, delivered, and analyzed. With cutting-edge AI capabilities, Graxion empowers educators to effortlessly generate, manage, and evaluate assessments—while providing students with personalized feedback, AI-generated video explanations, and curated learning resources.

---

## 🎯 Key Highlights

- ✍️ Manual, AI, and Hybrid Assessment Creation  
- 🤖 Automated Grading & Feedback  
- 📹 AI-Generated Video Explanations for Incorrect Answers  
- 🧠 SWOT-Based Performance Insights  
- 📚 Smart Resource Recommendations  
- 💬 Upcoming AI Chatbot for Doubt Clarification  

---

## 🔧 Features

### 👨‍🏫 For Teachers

- Create assessments manually, using AI, or both  
- Customize question type, difficulty, and topics  
- Assign assessments to students  
- Track performance and view SWOT analysis  

### 👩‍🎓 For Students

- Access assigned assessments and submit responses  
- Receive instant, AI-evaluated scores  
- Get personalized feedback for each question  
- Watch custom AI-generated videos explaining incorrect answers  
- Explore recommended YouTube videos and articles  
- View SWOT analysis for continuous improvement  

### 🧠 AI Engine (Powered by Gemini API)

- Topic-wise, difficulty-based, and concept-tagged question generation  
- Auto-grading of subjective and objective answers  
- Personalized feedback generator  
- AI-based explainer video creation  
- Smart content recommendation system  

---

## ⚙️ Architecture Overview

- **Frontend**: React.js (deployed on [Vercel]([https://vercel.com/](https://graxion.vercel.app/)))  
- **Backend + AI Services**: Node.js / Express (hosted on **Google Cloud Run**)  
- **AI Integration**: Gemini LLMs for assessment generation and evaluation  
- **Authentication**: Currently experimental (full system coming soon)  
- **Database**: MongoDB / Firebase (as per deployment)  
- **Resource API**: YouTube Data API + custom web scraping modules  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Malay-dev/graxion.git
cd graxion
```
### 2. Install Dependencies
Frontend
```bash
cd client
npm install
```
Backend
```bash
cd ../server
npm install
```

### 3. Environment Setup
Create .env files with the following variables:

GEMINI_API_KEY
YOUTUBE_API_KEY
DB_URI
PORT
(Optional) AUTH_SECRET or Firebase credentials

### 4. Run the App Locally
Frontend
```bash
cd client
npm run dev
```
Backend
```bash
cd ../server
npm run dev
```


### 🧪 Experimental Note
Authentication system is currently under development.
In future updates, users will be able to create secure accounts, manage personalized data, and experience full role-based access control.

📄 License
This project is licensed under the AGPL License.
