import { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
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
  const [redirect, setRedirect] = useState(false);
  const [isOnline, setIsOnline] = useState(false); 

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!userId || !targetUserid) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/chat/${targetUserid}`, {
          withCredentials: true,
        });

        const formattedMessages = res.data.map((msg) => ({
          senderId: msg.senderId,
          message: msg.text,
          time: new Date(msg.createdAt),
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Fetch chat error:", err.message);
        setRedirect(true);
      }
    };

    fetchMessages();
  }, [userId, targetUserid]);


  useEffect(() => {
    if (!userId || !targetUserid) return;

    socketRef.current = createSocketConnection();

    
    socketRef.current.emit("joinChat", { targetUserid });

   
    socketRef.current.emit("checkOnlineStatus", { targetUserid });

 
    socketRef.current.on("onlineStatus", (data) => {
      setIsOnline(data.online);
    });

   
    socketRef.current.on("userStatusChanged", (data) => {
      if (data.userId === targetUserid) {
        setIsOnline(data.online);
      }
    });

   
    socketRef.current.on("receiveMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          ...data,
          time: new Date(),
        },
      ]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, targetUserid]);

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = () => {
    if (!newMsg.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        senderId: userId,
        message: newMsg,
        time: new Date(),
      },
    ]);

    socketRef.current.emit("sendMessage", {
      targetUserid,
      newMsg,
    });

    setNewMsg("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  if (redirect) {
    return <Navigate to="/error" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-neutral-900 to-black text-white">
      <div className="w-full max-w-2xl bg-neutral-900 rounded-2xl shadow-2xl flex flex-col h-[85vh]">

        {/* 🔥 Chat Header */}
        <div className="p-4 border-b border-neutral-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chat</h2>

          {/* ✅ Dynamic Online Status */}
          <span
            className={`text-sm ${
              isOnline ? "text-green-400" : "text-red-400"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* 🔥 Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => {
            const isOwn =
              msg.senderId?.toString() === userId?.toString();

            return (
              <div
                key={index}
                className={`flex ${
                  isOwn ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs break-words ${
                    isOwn
                      ? "bg-blue-600 rounded-br-none"
                      : "bg-neutral-700 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>

                  <div className="text-xs text-neutral-300 mt-1 text-right">
                    {msg.time?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {/* 🔥 Input Section */}
        <div className="p-4 border-t border-neutral-700 flex gap-3">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-3 rounded-full bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-6 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
