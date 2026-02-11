# DevConnect Backend 🔥

This is the backend service for DevConnect built using Node.js, Express, MongoDB Atlas, and Socket.io.

---

## ⚙️ Core Responsibilities

- User Authentication (JWT)
- Secure cookie handling
- Connection management
- Real-time chat via Socket.io
- Stripe payment integration
- Stripe webhook verification
- Gemini AI API integration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Cookie Parser
- CORS
- Socket.io
- Stripe SDK
- Gemini API

---

## 🔐 Authentication Flow

1. User logs in.
2. Server generates JWT.
3. JWT is sent in HTTP-only cookie.
4. Protected routes validate JWT from cookie.

---

## 💬 WebSocket Integration

- Implemented using Socket.io
- Real-time one-to-one chat
- Messages persisted in MongoDB
- WebSocket proxied through Nginx in production

---

## 💳 Stripe Integration

- Payment intent creation
- Webhook route for payment verification
- Premium membership upgrade on successful payment

---

## 🌍 Environment Variables

Create `.env` file:

PORT=7777
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
FRONTEND_URL=https://your-domain
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
GEMINI_API_KEY=your_gemini_key


---

## 🚀 Run Locally

npm install
npm run dev


---

## 🚀 Production (PM2)

pm2 start src/app.js --name devTinder-backend
pm2 save


---

## 🧱 Deployment Notes

- Runs on port 7777
- Proxied via Nginx under `/api`
- SSL handled at Nginx level
- WebSocket upgrade headers configured