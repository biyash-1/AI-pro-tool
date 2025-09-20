"use client";

import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState({
    modelType: "gemini", // "gemini" or "imagen"
    aspectRatio: "1:1",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a description for the image");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, ...settings }),
      });

      const data = await response.json();

      if (response.ok) {
        const imageUrl = `data:${data.mimeType};base64,${data.image}`;
        setGeneratedImages((prev) => [imageUrl, ...prev.slice(0, 3)]);
      } else {
        setError(data.error || "Failed to generate image");
      }
    } catch (err) {
      setError("An error occurred while generating the image");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = (imageData: string, index: number) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `ai-generated-image-${Date.now()}-${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-800 mb-2">
            AI Image Generator
          </h1>
          <p className="text-lg text-purple-600">
            Create stunning AI-generated images powered by Google Gemini &
            Imagen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your image
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="A majestic wolf howling at a full moon..."
                  disabled={isLoading}
                />
              </div>

              {/* Settings Panel */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 mb-3">
                  Generation Settings
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Model
                    </label>
                    <select
                      value={settings.modelType}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          modelType: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="gemini">
                        Gemini 2.0 Flash Exp (Image)
                      </option>
                      <option value="imagen">Imagen 3.0</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={settings.aspectRatio}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          aspectRatio: e.target.value,
                        }))
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="1:1">Square (1:1)</option>
                      <option value="4:3">Standard (4:3)</option>
                      <option value="16:9">Widescreen (16:9)</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? "Generating Image..." : "Generate Image"}
              </button>
            </form>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Generated Images
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {generatedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="border-2 border-purple-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-3 bg-gray-50 flex justify-between">
                        <span className="text-sm text-gray-600">
                          Image {index + 1}
                        </span>
                        <button
                          onClick={() => downloadImage(imageUrl, index)}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && generatedImages.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-400">
                    Your generated images will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
