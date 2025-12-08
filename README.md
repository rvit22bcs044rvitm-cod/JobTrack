# 📌 JobTrack – Modern Job Application Tracker (MERN)

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Build-brightgreen?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-green?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-success?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-Design-purple?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-yellow?logo=jsonwebtokens&logoColor=white" />
</p>

---

# ⭐ **Professional Summary (Resume-Ready)**

**JobTrack is a full-stack MERN application that enables job seekers to track applications through a clean, LinkedIn-style dashboard.
It features drag-and-drop workflow, editable job details, customizable interview stages, and secure authentication.
Built with React + TailwindCSS (frontend) and Node/Express + MongoDB (backend), JobTrack demonstrates strong full-stack engineering skills, UI/UX design, API development, and state management.**

# 🚀 Features Overview

### 🔐 Authentication

* Secure JWT sign-in & sign-up
* Persistent login

### 🗂 Kanban Board Workflow

Four clear columns:

* **APPLIED**
* **PROCESS (Interview)**
* **JOB STATUS**
* **OFFER**

### ➕ Add Job Application

Supports:

* Company
* Role
* Description
* Location
* Salary

### ✏ Editable Job Popup

You can edit EVERYTHING:

* Company
* Role
* Location
* Salary
* Description
* All interview stages

### 🧩 Custom Interview Stages

Inside PROCESS column:

* Add steps like OA, Tech Rounds, HR…
* Mark as Upcoming or Completed
* Remove steps easily

### 🟡 Job Status Column

Fixed statuses (editable):

* Accepted
* Rejected
* On Hold

### 🟢 Offer Column

Track final decision:

* Received
* Not Received

### 🔄 Drag & Drop

Move jobs between columns smoothly.

### ❌ Delete Job

Clean removal from MongoDB.

### 🎨 Beautiful UI

* TailwindCSS
* Dark, modern, professional
* Perfectly centered layout
* Smooth modals
* LinkedIn-like interaction
---
## 📸 Screenshots

### 🔵 Login Page  
<img src="screenshots/login.png" width="800"/>

---

### 🔵 Dashboard View  
<img src="screenshots/dashboard.png" width="800"/>

---

### 🔵 Job Details Modal  
<img src="screenshots/details.png" width="800"/>

---

### 🔵 Add Job Modal  
<img src="screenshots/addjob.png" width="800"/>

---

### 🔵 Stages Popup  
<img src="screenshots/stages.png" width="800"/>


---

# 🛠 Tech Stack

### **Frontend**

* React.js
* Vite
* TailwindCSS
* @hello-pangea/dnd

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* bcryptjs

---

# 📂 Folder Structure

```
JobTrack/
│
├── client/        # React frontend
│   ├── src/
│   │   ├── AddJob.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── JobContext.jsx
│   │   ├── Auth.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── ...
│
├── server/        # Node backend
│   ├── index.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# 🧪 Local Setup (Run Project)

### 1️⃣ Clone repo

```bash
git clone https://github.com/YOUR_USERNAME/JobTrack.git
cd JobTrack
```

---

## 🔥 Backend Setup

### 2️⃣ Install backend dependencies

```bash
cd server
npm install
```

### 3️⃣ Create `.env` file

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
PORT=5001
```

### 4️⃣ Start backend

```bash
node index.js
```

---

## 💻 Frontend Setup

### 5️⃣ Install frontend dependencies

```bash
cd ../client
npm install
```

### 6️⃣ Start frontend

```bash
npm run dev
```

App runs at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

# ☁ Deployment Guide

## 🚀 FRONTEND DEPLOYMENT (Vercel)

1. Go to [https://vercel.com](https://vercel.com)
2. Connect your GitHub
3. Select **JobTrack** repo
4. For build settings:

   * Framework: **Vite**
   * Output folder: **dist**
5. Add environment variables (if any)
6. Deploy 🎉

---

## 🚀 BACKEND DEPLOYMENT (Render)

1. Go to [https://render.com](https://render.com)
2. Create **New Web Service**
3. Connect your **server folder** repo
4. Set:

   * Build Command: `npm install`
   * Start Command: `node index.js`
   * Environment variables:

     * `MONGO_URI`
     * `JWT_SECRET`
     * `PORT=10000` (Render usually auto-assigns)
5. Deploy 🎉

---