"use client";

import { useState } from "react";

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false); // 👈 new state
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image");
      return;
    }

    setIsLoading(true);
    setError("");
    setImageUrl("");

    try {
      const instruction = `Generate a high-quality image based on the following description. Provide only a direct image URL or base64 link:\n\n${prompt}`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: instruction }),
      });

      const data = await res.json();

      if (res.ok && data.result) {
        const url = data.result.trim();
        setIsImageLoading(true);
        setImageUrl(url);
      } else {
        setError(data.error || "Failed to generate image");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while generating the image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt("");
    setImageUrl("");
    setError("");
    setIsImageLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-700 mb-2">
            AI Image Generator
          </h1>
          <p className="text-lg text-pink-600">
            Create stunning AI images from your descriptions
          </p>
        </div>

       
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-none"
                placeholder="E.g., A futuristic city skyline at sunset with flying cars"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-pink-600 hover:to-orange-600 transition-all disabled:opacity-50"
              >
                {isLoading ? "Generating..." : "Generate Image"}
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

     
        {imageUrl && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-pink-700 mb-4">
              Generated Image
            </h2>

            {isImageLoading && (
              <div className="p-4 text-center text-pink-600 font-medium">
                Image is loading, please wait...
              </div>
            )}

            <img
              src={imageUrl}
              alt="AI Generated"
              className="w-full rounded-lg border border-pink-100"
              onLoad={() => setIsImageLoading(false)} // 👈 remove loading once image finishes
              onError={() => {
                setIsImageLoading(false);
                setError("Failed to load image");
              }}
            />

            {!isImageLoading && (
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => navigator.clipboard.writeText(imageUrl)}
                  className="px-4 py-2 border border-pink-300 rounded-lg text-pink-700 hover:bg-pink-50 transition-colors"
                >
                  Copy URL
                </button>
                <a
                  href={imageUrl}
                  download="ai-image.png"
                  className="px-4 py-2 border border-pink-300 rounded-lg text-pink-700 hover:bg-pink-50 transition-colors"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}

        {!imageUrl && !isLoading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-pink-700 mb-3">
              Tips for better images
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Be descriptive: include colors, mood, style, and perspective.</li>
              <li>Try adjectives: "vibrant", "futuristic", "realistic", "cartoonish".</li>
              <li>
                Specify scene elements: e.g., "mountain landscape at sunrise with
                mist".
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
