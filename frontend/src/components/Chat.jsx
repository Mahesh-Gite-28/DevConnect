import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";

const Chat = () => {
  const user = useSelector((store) => store.user);

  const userId = user?._id;
  const firstName = user?.firstName;
  const { targetUserid } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName,
      userId,
      targetUserid,
    });

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserid]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    socketRef.current.emit("sendMessage", {
      userId,
      targetUserid,
      newMsg,
    });

    // instantly show own message
    setMessages((prev) => [
      ...prev,
      { senderId: userId, message: newMsg },
    ]);

    setNewMsg("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-xl bg-neutral-800 rounded-xl p-4 flex flex-col h-[80vh]">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-xs ${
                msg.senderId === userId
                  ? "bg-blue-600 ml-auto"
                  : "bg-neutral-600"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 mt-4">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            className="flex-1 p-2 rounded bg-neutral-700"
            placeholder="Type message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
