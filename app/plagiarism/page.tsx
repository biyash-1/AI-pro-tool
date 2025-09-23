"use client";

import { useState } from "react";

export default function AIContentChecker() {
  const [text, setText] = useState("");
  const [action, setAction] = useState<"check_ai" | "humanize">("check_ai");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/plagiarism", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to process text");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while processing text");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setText("");
    setResult("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">AI Content Checker & Humanizer</h1>
          <p className="text-lg text-green-600">
            Detect AI-style text or humanize content for readability
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
                Text
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Paste your text here..."
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                <option value="check_ai">Check AI / Generic Style</option>
                <option value="humanize">Humanize Text</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-lime-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-lime-600 transition-all disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">
              {action === "check_ai" ? "AI / Generic Style Analysis" : "Humanized Text"}
            </h2>
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
