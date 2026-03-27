# 🏥 HealthBridge NGO — Healthcare Support Web App

A full-stack healthcare support platform for NGOs, built with React, Node.js, Express, and MongoDB. Features AI-powered patient triage, a smart FAQ chatbot, and instant auto-response for contact queries.

---

## 🚀 Live Demo
> Deploy to Render/Vercel and paste your link here.

## 📁 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, CSS3, Google Fonts      |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB + Mongoose ODM            |
| AI / Automation | Rule-based NLP (keyword matching) |
| Deployment | Render (backend) + Vercel (frontend) |

---

## 🤖 AI & Automation Features

### 1. AI Patient Triage Summary
When a patient submits the support form, the server auto-generates a structured case summary using keyword and urgency analysis:
- Assigns priority level (Low / Medium / High / Critical)
- Generates a human-readable case description
- Displayed to the patient instantly after submission

### 2. Smart Auto-Reply (Contact Form)
On contact form submission, the backend reads the subject + message and generates a context-aware auto-response:
- Detects topics: appointment, volunteer, donation, emergency, medication
- Returns a relevant reply in < 500ms
- Shown to the user immediately

### 3. FAQ Chatbot (HealthBot)
A floating chatbot widget that answers common NGO-related questions 24/7:
- Covers: hours, appointments, volunteer registration, free services, donations, emergencies, medications, location
- Keyword-matching engine with fallback response
- Quick-reply suggestion chips for common queries
- Typing indicator for realistic UX

---

## 🏗️ Project Structure

```
healthcare-app/
├── client/                  # React frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Hero.js         # Landing page
│       │   ├── PatientForm.js  # Patient support form + AI summary
│       │   ├── VolunteerForm.js
│       │   ├── ContactForm.js  # Auto-response AI
│       │   ├── Chatbot.js      # Floating FAQ chatbot
│       │   └── Footer.js
│       ├── App.js
│       └── index.js
└── server/                  # Node/Express backend
    ├── models/
    │   ├── Patient.js
    │   ├── Volunteer.js
    │   └── Contact.js
    ├── routes/
    │   ├── patients.js      # AI triage logic
    │   ├── volunteers.js
    │   ├── contacts.js      # Auto-reply logic
    │   └── chatbot.js       # FAQ engine
    └── index.js
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd healthcare-app
npm run install-all
```

### 2. Configure Environment
```bash
# In /server, copy and fill:
cp .env.example .env
# Set MONGO_URI to your MongoDB Atlas connection string
```

### 3. Run Development
```bash
npm run dev
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## 🌐 Deploy to Production

### Backend → Render
1. Create new Web Service on [render.com](https://render.com)
2. Root directory: `server`
3. Build: `npm install`
4. Start: `node index.js`
5. Add env vars: `MONGO_URI`, `CLIENT_URL`

### Frontend → Vercel
1. Import repo to [vercel.com](https://vercel.com)
2. Root directory: `client`
3. Add env var: `REACT_APP_API_URL=https://your-render-url.onrender.com`
4. Deploy!

---

## 🌍 NGO Use Case

**HealthBridge** is designed for NGOs operating in underserved communities (modeled on Raipur, Chhattisgarh) to:
- Digitize patient intake and reduce administrative overhead
- Match volunteers to patient needs based on skills & location
- Provide 24/7 basic query resolution via chatbot (no staff needed off-hours)
- Auto-prioritize cases so critical patients get faster human attention

---

## 👩‍💻 Submitted by
Submission for HealthBridge NGO Internship Assignment  
Deadline: 28 March 2026  
Contact: Harika.M
