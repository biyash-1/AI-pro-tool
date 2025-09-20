// app/textsummarizer/page.tsx
"use client";

import { useState } from "react";

export default function TextSummarizer() {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError("Please enter some text to summarize");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const prompt = `Please summarize the following text in a clear and concise manner:\n\n${inputText}`;
      
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSummary(data.result);
      } else {
        setError(data.error || "Failed to generate summary");
      }
    } catch (err) {
      setError("An error occurred while generating the summary");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setSummary("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-800 mb-2">Text Summarizer</h1>
          <p className="text-lg text-cyan-600">
            Transform lengthy text into concise summaries with AI
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
                Text to summarize
              </label>
              <textarea
                id="inputText"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                placeholder="Paste your text here..."
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Summary...
                  </>
                ) : (
                  "Generate Summary"
                )}
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

        {summary && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-cyan-800 mb-4">Summary</h2>
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-100">
              <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Original: {inputText.split(/\s+/).length} words | 
                Summary: {summary.split(/\s+/).length} words
              </p>
              
              <button
                onClick={() => navigator.clipboard.writeText(summary)}
                className="flex items-center gap-2 px-4 py-2 text-cyan-700 hover:bg-cyan-100 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Summary
              </button>
            </div>
          </div>
        )}

        {!summary && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-cyan-800 mb-4">How to use</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Paste or type your text in the input box above</li>
              <li>Click "Generate Summary" to create a concise summary</li>
              <li>Copy your summary with the copy button</li>
              <li>Try with articles, reports, or any lengthy text</li>
            </ul>
            
            <div className="mt-6 p-4 bg-cyan-50 rounded-lg">
              <h3 className="font-semibold text-cyan-800 mb-2">Example text to try:</h3>
              <p className="text-sm text-gray-600">
                "Machine learning is a subset of artificial intelligence that focuses on building systems 
                that learn from data. Instead of being explicitly programmed to perform a task, these systems 
                use algorithms to identify patterns and make predictions or decisions based on data. The more 
                data these systems are exposed to, the better they become at their designated tasks."
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}