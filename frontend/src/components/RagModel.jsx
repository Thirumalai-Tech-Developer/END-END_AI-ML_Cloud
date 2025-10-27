import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const RagModel = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/rag_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.answer || "No response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `❌ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Removed the auto-scroll here
  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.sender === "bot") {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  useEffect(() => {
    hljs.highlightAll();
  }, [messages]);

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-6 rounded-2xl">
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl p-4 flex flex-col h-[80%]">
        <h1 className="text-2xl font-bold text-center text-orange-400 mb-4">
          🤖 RAG Model Chat
        </h1>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-3 bg-gray-800 rounded-lg">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-blue-600 self-end text-white ml-auto"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              {msg.sender === "bot" ? (
                <pre className="whitespace-pre-wrap wrap-break-words">
                  <code>{msg.text}</code>
                </pre>
              ) : (
                msg.text
              )}
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 italic animate-pulse">Thinking...</div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleSend();
            }}
            placeholder={loading ? "Model is thinking..." : "Ask something..."}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default RagModel;
