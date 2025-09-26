"use client";

import { useState } from "react";

export default function TranslatorPage() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const supportedLanguages = [
    "Spanish",
    "French",
    "German",
    "Nepali",
    "Hindi",
    "Chinese (Simplified)",
    "Japanese",
    "Korean",
    "Portuguese",
    "Arabic",
    "Russian",
    "Italian",
    "Dutch",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult("");

    try {
      const prompt = `Translate the following text into ${language}. Preserve the original meaning and tone. Provide only the translated text:\n\n${text}`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.result || "");
      } else {
        setError(data.error || "Failed to translate text");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while translating");
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Language Translator
          </h1>
          <p className="text-lg text-indigo-600">
            Quickly translate text between languages using AI
          </p>
        </div>

   
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
       
            <div>
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Text to translate
              </label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Paste text here..."
                disabled={isLoading}
              />
            </div>

            {/* Language selector + Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {supportedLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="sm:w-40 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                {isLoading ? "Translating..." : "Translate"}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="sm:w-28 w-full px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </form>
        </div>

   
        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
              Translation
            </h2>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-gray-700 whitespace-pre-wrap">{result}</p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Words:{" "}
                {text.trim().split(/\s+/).filter(Boolean).length} →{" "}
                {result.trim().split(/\s+/).filter(Boolean).length}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    setText(result);
                    setResult("");
                  }}
                  className="px-4 py-2 border border-indigo-300 rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors"
                >
                  Use as input
                </button>
              </div>
            </div>
          </div>
        )}

    
        {!result && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-indigo-800 mb-3">
              Tips for better translations
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                Be specific about the target language and dialect if needed
                (e.g., "Portuguese (Brazil)").
              </li>
              <li>
                Shorter sentences often translate more accurately; consider
                splitting long paragraphs.
              </li>
              <li>
                For technical or legal text, mention the domain: "Translate into
                German for a legal contract."
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
