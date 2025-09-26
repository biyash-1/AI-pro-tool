"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function QnAAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const prompt = `Answer the following question in a clear, helpful, and concise way:\n\n${question}`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setAnswer(data.result);
      } else {
        setError(data.error || "Failed to generate answer");
      }
    } catch (err) {
      setError("An error occurred while generating the answer");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Q&A Assistant</h1>
          <p className="text-lg text-green-600">
            Ask any question and get instant AI-powered answers
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="E.g., What is the capital of Japan?"
                disabled={isLoading}
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50"
              >
                {isLoading ? "Thinking..." : "Ask AI"}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Answer */}
        {answer && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Answer</h2>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100 prose max-w-none">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
