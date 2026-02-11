# DevConnect 🚀

DevConnect is a full-stack developer networking platform where developers can connect, chat in real-time, and upgrade to premium memberships. The platform also integrates an AI assistant powered by Gemini API to enhance user interaction.

This project is fully deployed on AWS EC2 with production-grade configuration including Nginx reverse proxy, PM2 process management, WebSocket support, Stripe payments with webhook, and SSL via Let's Encrypt.

---

## 🌐 Live Demo

https://devtinder-connect.duckdns.org

---

## 🧠 Core Features

- 🔐 JWT Authentication (HTTP-only cookies)
- 👤 Profile Management
- 🔍 Developer Feed & Smart Matching
- 🤝 Send & Accept Connection Requests
- 💬 Real-time Chat using Socket.io
- 🤖 AI Assistant (Gemini API Integration)
- 💳 Premium Membership (Stripe Integration)
- 🔔 Stripe Webhook Handling
- 🔒 Secure Backend Routing
- 🌍 Fully Deployed on AWS EC2

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- Tailwind CSS / DaisyUI
- Axios
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Socket.io
- JWT Authentication
- Stripe Payment Gateway
- Gemini API Integration

### Deployment & Infrastructure
- AWS EC2 (Ubuntu)
- Nginx (Reverse Proxy)
- PM2 (Process Manager)
- Let's Encrypt SSL
- WebSocket Support via Nginx Upgrade Headers

---

## 🏗 Architecture Overview

User (Browser)  
⬇  
HTTPS (SSL)  
⬇  
Nginx (Reverse Proxy)  
⬇  
Backend (Node.js running on port 7777 via PM2)  
⬇  
MongoDB Atlas  

WebSocket connections are proxied via Nginx to backend server.

---

## 💳 Payment System

- Stripe integration
- Secure webhook handling
- Premium membership plans (Silver / Gold)
- Payment success & failure handling

---

## 🤖 AI Integration

Gemini API is integrated to provide an AI assistant inside the platform for enhanced user interaction.

---

## 🚀 Deployment Summary

- Backend runs on port 7777
- Nginx serves frontend static files from `/var/www/html`
- `/api` routes proxied to backend
- WebSocket upgrade headers configured
- SSL configured via Certbot (Let’s Encrypt)

---

## 👨‍💻 Author

Mahesh Ramdas Gite  
B.E Computer Science Engineering  
Full-Stack Developer 
