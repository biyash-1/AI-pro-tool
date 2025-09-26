
export default function Home() {
  return (
    <div className="space-y-8">
      <div className="h-[30vh] min-h-[250px] rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 flex flex-col justify-center text-white shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to AI Pro Tool
        </h1>
        <p className="text-xl md:text-2xl opacity-90">
          Your enhanced AI content creation app
        </p>
        <p className="mt-4 max-w-2xl">
          Create stunning content, summarize text, generate images, and much
          more with our powerful AI tools
        </p>
        <button className="mt-6 bg-white text-cyan-700 px-6 py-3 rounded-lg font-semibold w-fit hover:bg-cyan-50 transition-colors">
          Get Started
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold mb-2">AI Tools</h3>
          <p className="text-gray-600">
            Access our suite of powerful AI-powered content creation tools
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
          <p className="text-gray-600">
            Get results in seconds with our optimized AI algorithms
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">Creative Output</h3>
          <p className="text-gray-600">
            Generate unique and creative content tailored to your needs
          </p>
        </div>
      </div>
    </div>
  );
}
