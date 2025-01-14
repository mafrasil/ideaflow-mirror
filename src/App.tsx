import Editor from "./components/editor/editor";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-xl font-semibold leading-6 text-gray-900 flex items-center gap-2">
          Ideaflow Editor <span className="text-blue-500">✨</span>
        </h3>
        <div className="mt-2 text-sm text-gray-600 space-y-2">
          <p>
            Type{" "}
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">
              &lt;&gt;
            </kbd>{" "}
            to trigger autocomplete.
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
        <div className="mt-5">
          <Editor />
        </div>
      </div>
    </div>
  );
}

export default App;
