import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const { targetUserid } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const socketRef = useRef(null);

  // ✅ 1️⃣ Load old messages from DB when chat opens
  useEffect(() => {
    if (!userId || !targetUserid) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/chat/${targetUserid}`,
          { withCredentials: true }
        );

        const formattedMessages = res.data.map((msg) => ({
          senderId: msg.senderId,
          message: msg.text,
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Fetch chat error:", err.message);
      }
    };

    fetchMessages();
  }, [userId, targetUserid]);

  // ✅ 2️⃣ Setup socket connection
  useEffect(() => {
    if (!userId || !targetUserid) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", { targetUserid });

    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, targetUserid]);

  // ✅ 3️⃣ Send message
  const sendMessage = () => {
    if (!newMsg.trim()) return;

    socketRef.current.emit("sendMessage", {
      targetUserid,
      newMsg,
    });

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
                msg.senderId?.toString() === userId?.toString()
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
