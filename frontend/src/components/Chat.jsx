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
  const [targetUser, setTargetUser] = useState(null);

  const socketRef = useRef(null);
  const messageContainerRef = useRef(null);
  const isInitialLoad = useRef(true);

  // =========================
  // 🔹 Fetch Target User Info
  // =========================
  useEffect(() => {
    if (!targetUserid) return;

    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/profile/targetUser/${targetUserid}`,
          { withCredentials: true }
        );
        setTargetUser(res.data);
      } catch (err) {
        console.error("Error fetching target user:", err);
      }
    };

    fetchTargetUser();
  }, [targetUserid]);

  // =========================
  // 🔹 Load Old Messages
  // =========================
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

  // =========================
  // 🔌 Socket Setup
  // =========================
  useEffect(() => {
    if (!userId || !targetUserid) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { targetUserid });
    socket.emit("checkOnlineStatus", { targetUserid });

    socket.on("onlineStatus", (data) => {
      setIsOnline(data.online);
    });

    socket.on("userStatusChanged", (data) => {
      if (data.userId === targetUserid) {
        setIsOnline(data.online);
      }
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => {
        if (data.senderId?.toString() === userId?.toString()) {
          return prev;
        }

        return [
          ...prev,
          {
            ...data,
            time: new Date(),
          },
        ];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, targetUserid]);

  // =========================
  // 🔄 Controlled Auto Scroll
  // =========================
  useEffect(() => {
    if (!messageContainerRef.current) return;

    // First load pe auto scroll nahi karenge
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Sirf message container ko scroll karenge
    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;

  }, [messages]);

  // =========================
  // 📤 Send Message
  // =========================
  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const messageObj = {
      senderId: userId,
      message: newMsg,
      time: new Date(),
    };

    setMessages((prev) => [...prev, messageObj]);

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
    <div className="h-[calc(100vh-80px)] mt-20 bg-gradient-to-br from-black via-neutral-900 to-black text-white flex justify-center overflow-hidden">

      <div className="w-full max-w-2xl bg-neutral-900 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-neutral-700 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {targetUser && (
              <img
                src={targetUser.photoUrl}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            )}

            <div>
              <h2 className="text-lg font-semibold">
                {targetUser
                  ? `${targetUser.firstName} ${targetUser.lastName}`
                  : "Chat"}
              </h2>

              <span
                className={`text-xs ${
                  isOnline ? "text-green-400" : "text-red-400"
                }`}
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={messageContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
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
        </div>

        {/* Input */}
        <div className="p-4 border-t border-neutral-700 flex gap-3 flex-shrink-0">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 p-3 rounded-full bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            disabled={!newMsg.trim()}
            className={`px-6 rounded-full transition ${
              newMsg.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
