import { useParams } from "react-router-dom";

const Chat = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 flex items-center justify-center px-4">
      
      {/* Chat Container */}
      <div className="w-full max-w-4xl h-[85vh] bg-neutral-800 rounded-2xl shadow-xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="h-16 bg-neutral-900 flex items-center px-6 border-b border-neutral-700">
          <div className="w-10 h-10 bg-neutral-700 rounded-full mr-4"></div>
          <div>
            <h2 className="text-white font-semibold">User Name</h2>
            <p className="text-sm text-neutral-400">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Incoming Message */}
          <div className="flex">
            <div className="bg-neutral-700 text-white px-4 py-2 rounded-xl max-w-xs">
              Hello 👋
            </div>
          </div>

          {/* Outgoing Message */}
          <div className="flex justify-end">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl max-w-xs">
              Hi! How are you?
            </div>
          </div>

        </div>

        {/* Input Area */}
        <div className="h-16 bg-neutral-900 border-t border-neutral-700 flex items-center px-4 gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-neutral-700 text-white px-4 py-2 rounded-lg focus:outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>

      </div>
    </div>
  );
};

export default Chat;
