# DevConnect Frontend 💻

This is the frontend of DevConnect built using React (Vite), Redux Toolkit, and Socket.io-client.

---

## 🎯 Core Features

- Authentication UI
- Developer Feed
- Smart Matching
- Real-time Chat
- AI Assistant Integration
- Stripe Payment UI
- Premium Membership Upgrade

---

## 🛠 Tech Stack

- React
- Vite
- Redux Toolkit
- Tailwind CSS
- DaisyUI
- Axios
- Socket.io-client

---

## ⚙️ Environment Variables

Create `.env`:

For local:

VITE_BASE_URL=http://localhost:7777


For production:

VITE_BASE_URL=https://devtinder-connect.duckdns.org/

---

## 🚀 Run Locally

npm install
npm run dev


---

## 🏗 Build for Production

npm run build

After build:

Copy `dist/` folder contents to:

/var/www/html

Nginx serves the static files.

---

## 🌍 Production Configuration

- API calls routed via `/api`
- WebSocket connects through Nginx proxy
- HTTPS enforced via SSL certificate
