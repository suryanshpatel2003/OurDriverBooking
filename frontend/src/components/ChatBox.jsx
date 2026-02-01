import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import { getChatHistory, sendMessage } from "../services/chat.api";

export default function ChatBox({ rideId }) {
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  /* ===== JOIN RIDE + LOAD CHAT ===== */
  useEffect(() => {
    if (!socket || !rideId) return;

    // 🔥 ensure join immediately
    socket.emit("join_ride", rideId);

    getChatHistory(rideId).then((res) => {
      setMessages(res.data.data);
    });

    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat_message");
  }, [rideId, socket]);

  /* ===== SEND MESSAGE ===== */
  const send = async () => {
    if (!text.trim()) return;
    await sendMessage({ rideId, message: text });
    setText("");
  };

  /* ===== UI ===== */
  return (
    <div className="border rounded p-3 flex flex-col h-64 bg-white">
      <h3 className="font-semibold mb-2">Chat with Client</h3>

      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className="max-w-[80%] p-2 rounded text-sm bg-gray-100"
          >
            {m.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border flex-1 p-1"
          placeholder="Type message..."
        />
        <button
          onClick={send}
          className="bg-black text-white px-3"
        >
          Send
        </button>
      </div>
    </div>
  );
}
