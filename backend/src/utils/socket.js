const socket = require("socket.io");
const socketAuth = require("../middlewares/socketAuth");
const Chat = require("../Models/chat");

const initiallizeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true, // 🔥 VERY IMPORTANT
    },
  });

  // 🔐 Apply Authentication Middleware
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user._id);

    socket.on("joinChat", ({ targetUserid }) => {
      const userId = socket.user._id; // 🔥 NEVER trust frontend

      const roomId = [userId, targetUserid].sort().join("_");

      socket.join(roomId);

      console.log(socket.user.firstName + " joined room - " + roomId);
    });

    socket.on("sendMessage", async ({ targetUserid, newMsg }) => {
      try {
        const userId = socket.user._id;

        const roomId = [userId, targetUserid].sort().join("_");

        // 🔎 Find existing chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, targetUserid] },
        });

        // 🆕 If no chat, create one
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserid],
            messages: [],
          });
        }

        // 💬 Push new message
        chat.messages.push({
          senderId: userId,
          text: newMsg,
        });

        await chat.save();

        // 📡 Emit message to room
        io.to(roomId).emit("receiveMessage", {
          senderId: userId,
          message: newMsg,
        });
      } catch (err) {
        console.log("Message Save Error:", err.message);
      }
    });
  });
};

module.exports = initiallizeSocket;
