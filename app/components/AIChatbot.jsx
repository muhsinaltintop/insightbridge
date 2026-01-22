"use client";

import { useState } from "react";

export default function AIChatbot() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "/api/ai",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: userMessage.content,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("AI request failed");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while contacting the AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white space-y-3">
      <h3 className="text-base font-semibold">
        Ask the AI about your data
      </h3>

      {/* Chat window */}
      <div className="h-64 overflow-y-auto border rounded-md p-3 space-y-2 bg-slate-50">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            Ask questions like:
            <br />• Why is my conversion rate flat?
            <br />• What should I focus on improving?
          </p>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded-md max-w-[85%]
              ${m.role === "user"
                ? "bg-slate-900 text-white ml-auto"
                : "bg-white border text-slate-800"
              }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="text-xs text-slate-500">
            AI is thinking…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your data..."
          className="flex-1 px-3 py-2 border rounded-md text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={handleSend}
          disabled={loading || !question.trim()}
          className={`px-4 py-2 rounded-md text-sm font-medium
            ${loading || !question.trim()
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
        >
          Send
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}
