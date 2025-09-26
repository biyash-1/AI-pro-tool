"use client";

import { useState } from "react";

export default function CodeTranslatorPage() {
  const [inputCode, setInputCode] = useState("");
  const [targetLang, setTargetLang] = useState("Python");
  const [translatedCode, setTranslatedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    "JavaScript",
    "Python",
    "TypeScript",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "PHP",
    "Swift",
    "Kotlin",
  ];

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputCode.trim()) {
      setError("Please enter code to translate");
      return;
    }

    setIsLoading(true);
    setError("");
    setTranslatedCode("");

    try {
      const prompt = `Detect the programming language of the following code and translate it into ${targetLang}. Preserve functionality and syntax. Provide only the translated code, no explanations:\n\n${inputCode}`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok && data.result) {
        setTranslatedCode(data.result.trim());
      } else {
        setError(data.error || "Failed to translate code");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while translating code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputCode("");
    setTranslatedCode("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-700 mb-2">AI Code Translator</h1>
          <p className="text-lg text-green-600">
            Translate code to your desired programming language with AI
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTranslate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter code
              </label>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                placeholder="Paste your code here..."
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Language
                </label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="sm:w-40 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50"
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

            {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
          </form>
        </div>

        {/* Translated Code */}
        {translatedCode && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Translated Code</h2>
            <pre className="bg-green-50 p-4 rounded-lg border border-green-100 overflow-x-auto whitespace-pre-wrap">
              {translatedCode}
            </pre>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(translatedCode)}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
              >
                Copy
              </button>
              <button
                onClick={() => {
                  setInputCode(translatedCode);
                  setTranslatedCode("");
                }}
                className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors"
              >
                Use as Input
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
