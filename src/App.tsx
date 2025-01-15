import Editor from "./components/editor/editor";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="mx-auto max-w-3xl h-[calc(100vh-8rem)]">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-semibold leading-6 text-gray-900 flex items-center justify-center gap-2 mb-3">
            Ideaflow Editor{" "}
            <span className="text-blue-500 animate-bounce">✨</span>
          </h3>
          <p className="text-gray-600 text-sm">
            A powerful editor for connecting ideas and thoughts
          </p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="mt-2 text-sm text-gray-600 space-y-2">
            <p className="flex items-center gap-2">
              <span className="text-blue-500">Pro tip:</span>
              Type{" "}
              <kbd className="px-2 py-1 bg-gray-100 rounded text-sm border shadow-sm">
                &lt;&gt;
              </kbd>{" "}
              to trigger autocomplete
            </p>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                People
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                AI Commands
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Tags
              </span>
            </div>
          </div>
          <div className="mt-5 h-[calc(100%-6rem)]">
            <Editor defaultContent="Welcome to Ideaflow!" />
          </div>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200 shadow-sm">
          <p className="text-purple-700 text-sm flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span>
              Try typing{" "}
              <kbd className="px-1.5 py-0.5 bg-white rounded text-xs border shadow-sm">
                {"<>joke"}
              </kbd>{" "}
              to get an AI-generated joke!
              <span className="text-purple-500 text-xs ml-2">
                (Simulated API but works!)
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
