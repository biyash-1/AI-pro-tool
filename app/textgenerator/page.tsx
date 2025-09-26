"use client";
import ReactMarkdown from "react-markdown";

import { useState } from "react";

export default function TextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.result);
      } else {
        setError(data.error || "Failed to generate text");
      }
    } catch (err) {
      setError("An error occurred while generating text");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">AI Text Generator</h1>
          <p className="text-lg text-purple-600">
            Create original content with AI
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                placeholder="E.g., Write a short story about a robot learning to dance..."
                disabled={isLoading}
              />
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate Text"}
            </button>
          </form>
        </div>

        {output && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Generated Output</h2>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
      <ReactMarkdown>{output}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
