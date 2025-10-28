import { useState, useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

const LlmModels = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [local, setLocal] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/llm_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.response || "No response." };
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

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.sender === "bot") {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleLocal = async () => {
    try {
        await fetch("http://localhost:5000/local_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: true }),
        });
        setLocal(true);
    } catch (err) {
        console.log("Error setting local LLM:", err);
    }
    };

    const handleGemini = async () => {
    try {
        await fetch("http://localhost:5000/local_api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: false }),
        });
        setLocal(true);
    } catch (err) {
        console.log("Error setting local LLM:", err);
    }
    };


    useEffect(() => {
    if (messages.length > 0) {
        // Re-run syntax highlighting every time messages update
        document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
        });
    }
    }, [messages]);


  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-950 text-white p-6 rounded-2xl">
        {!local && (<div className="flex justify-around w-full">
            <button
            onClick={handleLocal}
            className="flex justify-center bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-md shadow"
        >
            local LLM
        </button>
        <button
            onClick={handleGemini}
            className="flex justify-center bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-md shadow"
        >
            Gemini API
        </button>
        </div>)}
      {local && (<div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl p-4 flex flex-col h-[80%]">
        <h1 className="text-2xl font-bold text-center text-orange-400 mb-4">
          🤖 LLM Model Chat
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
                <pre className="whitespace-pre-wrap break-words">
                    <code className="language-python">{msg.text}</code>
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
      </div>)}
    </section>
  );
};

export default LlmModels;
