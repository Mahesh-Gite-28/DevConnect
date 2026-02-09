const socket = require("socket.io");
const socketAuth = require("../middlewares/socketAuth");
const Chat = require("../Models/chat");

const onlineUsers = new Map(); 
// Map<userId, Set<socketId>>

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // ==============================
    // ✅ ONLINE LOGIC (Multi-tab Safe)
    // ==============================
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    io.emit("userStatusChanged", {
      userId,
      online: true,
    });

    // ==============================
    // 🔥 JOIN CHAT ROOM
    // ==============================
    socket.on("joinChat", ({ targetUserid }) => {
      const roomId = [userId, targetUserid].sort().join("_");
      socket.join(roomId);
    });

    // ==============================
    // 💬 SEND MESSAGE
    // ==============================
    socket.on("sendMessage", async ({ targetUserid, newMsg }) => {
      try {
        const roomId = [userId, targetUserid].sort().join("_");

        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserid] },
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserid],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: userId,
          text: newMsg,
        });

        await chat.save();

        io.to(roomId).emit("receiveMessage", {
          senderId: userId,
          message: newMsg,
        });

      } catch (err) {
        console.log("Message Save Error:", err.message);
      }
    });

    // ==============================
    // ❓ CHECK ONLINE STATUS
    // ==============================
    socket.on("checkOnlineStatus", ({ targetUserid }) => {
      const isOnline = onlineUsers.has(targetUserid);

      socket.emit("onlineStatus", {
        userId: targetUserid,
        online: isOnline,
      });
    });

    // ==============================
    // ❌ DISCONNECT LOGIC
    // ==============================
    socket.on("disconnect", () => {
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).delete(socket.id);

        if (onlineUsers.get(userId).size === 0) {
          onlineUsers.delete(userId);

          io.emit("userStatusChanged", {
            userId,
            online: false,
          });
        }
      }

      console.log("User Disconnected:", userId);
    });
  });
};

module.exports = initializeSocket;
