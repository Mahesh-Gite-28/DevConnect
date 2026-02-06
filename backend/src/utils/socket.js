const socket = require("socket.io");

const initiallizeSocket = (server) => {

  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {

    socket.on("joinChat", ({ firstName, userId, targetUserid }) => {

      const roomId = [userId, targetUserid].sort().join("_");
      socket.join(roomId);

      console.log(firstName + " joined room - " + roomId);
    });

    socket.on("sendMessage", ({ userId, targetUserid, newMsg }) => {

      const roomId = [userId, targetUserid].sort().join("_");

      io.to(roomId).emit("receiveMessage", {
        senderId: userId,
        message: newMsg,
      });

    });

  });
};

module.exports = initiallizeSocket;
