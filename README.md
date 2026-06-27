PRD for reference, no feedback expected from chatgpt yet.

OpenChat - Product Requirements Document (PRD)

1. Project Overview

Project Name

OpenChat – Real-Time Public Chat Rooms

Project Type

Mini Project / Proof of Concept (POC)

Objective

Build a real-time public group chat application using Node.js, Express.js, Socket.IO, MongoDB and Vanilla JavaScript. The project is designed to help students understand how modern web applications are planned, developed, deployed and demonstrated.

Expected Outcome

At the end of this project, every student should have:

- A fully working real-time chat application
- A public GitHub repository
- A live deployed application
- Hands-on experience with modern backend development concepts

---

2. Scope

In Scope

- Public Chat Rooms
- Real-Time Messaging
- Message Persistence
- Online Users
- Join / Leave Notifications
- Firebase Authentication
- Cloud Deployment

Out of Scope

- Private Messaging
- Voice/Video Calling
- File Sharing
- Message Encryption
- Admin Panel

---

3. Learning Objectives

Students will gain practical experience with:

- HTML5
- CSS3
- Bootstrap / Tailwind CSS
- Vanilla JavaScript
- Express.js
- REST APIs
- Socket.IO
- MongoDB
- Mongoose
- Firebase Authentication
- Firebase Hosting
- Render Deployment
- Git & GitHub
- Environment Variables
- Real-Time Communication
- Cloud Deployment

---

4. Technology Stack

Frontend

- HTML5
- CSS3
- Bootstrap or Tailwind CSS
- Vanilla JavaScript

Backend

- Node.js
- Express.js
- Socket.IO

Database

- MongoDB Atlas
- Mongoose

Authentication

- Firebase Authentication
  - Email & Password Sign Up
  - Login
  - Logout

Hosting

Frontend

- Firebase Hosting

Backend

- Render

Version Control

- Git
- GitHub

---

5. Core Functionalities

Guest Mode

- Join any public room
- Enter display name
- Start chatting

Authenticated Mode

- Sign Up
- Login
- Logout
- Display authenticated user information

Chat Features

- Create / Join Room
- Real-Time Messaging
- Message History
- Online Users
- Join Notification
- Leave Notification

Stretch Features

- Typing Indicator
- Emoji Support
- Dark Mode
- Responsive Design

---

6. Database Design

Rooms Collection

- _id
- roomName
- createdAt

Messages Collection

- _id
- roomId
- username
- firebaseUid (optional)
- message
- createdAt

---

7. API Summary

REST APIs

- Create Room
- Join Room
- Get Message History

Socket.IO Events

- Join Room
- Send Message
- Receive Message
- User Joined
- User Left
- Typing
- Stop Typing

---

8. Project Milestones

Milestone 1 — Foundation

Objective

Set up the project structure and create the basic user interface.

Deliverables

- Git Repository
- Express Server
- Basic HTML UI
- Join Room Screen
- Folder Structure

Working Milestone

Users can open the application and access the Join Room page.

Concepts Covered

- Express.js
- Static Files
- Bootstrap / Tailwind
- Git
- GitHub

---

Milestone 2 — Database Integration

Objective

Connect the application to MongoDB and store chat data.

Deliverables

- MongoDB Atlas Connection
- Room Management
- Store Messages
- Load Previous Messages

Working Milestone

Users can join a room and view previous chat messages stored in the database.

Concepts Covered

- MongoDB
- Mongoose
- CRUD Operations
- REST APIs

---

Milestone 3 — Real-Time Chat

Objective

Implement live communication using Socket.IO.

Deliverables

- Socket.IO Server
- Socket.IO Client
- Live Messaging
- Join / Leave Notifications
- Online Users

Working Milestone

Two or more users can communicate in real time from different browser windows or devices.

Concepts Covered

- WebSockets
- Event-Driven Programming
- Real-Time Communication

---

Milestone 4 — Authentication & Deployment

Objective

Secure the application and deploy it to the cloud.

Deliverables

- Firebase Authentication
- Sign Up
- Login
- Logout
- Firebase Hosting (Frontend)
- Render Deployment (Backend)

Working Milestone

Users can create an account, log in, access the chat application and use the live deployed version.

Concepts Covered

- Firebase Authentication
- User Identity
- Environment Variables
- Cloud Deployment
- Production Configuration

---

9. Final Deliverables

Each student should submit:

- GitHub Repository
- Live Project URL
- Source Code
- README
- Project Screenshots
- Short Demo Video (Optional)

---

10. Project Architecture

HTML + Bootstrap / Tailwind
            │
            ▼
    Vanilla JavaScript
            │
 REST APIs + Socket.IO
            │
            ▼
   Node.js + Express.js
            │
     ┌──────┴─────────┐
     │                │
     ▼                ▼
MongoDB Atlas   Firebase Authentication
            │
            ▼
Frontend → Firebase Hosting
Backend  → Render

---

11. Learning Outcomes

By the end of this project, students will understand:

- How to plan a software project
- How frontend and backend communicate
- How REST APIs and WebSockets work together
- How MongoDB stores application data
- How Firebase Authentication secures applications
- How to deploy a full-stack application
- How to use Git and GitHub in a real project
- How to present a portfolio-ready project during interviews
