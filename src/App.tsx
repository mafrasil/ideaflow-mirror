import Editor from "./components/editor/editor";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Ideaflow Editor
        </h3>
        <div className="mt-2 text-sm text-gray-500">
          Type &lt;&gt; to trigger autocomplete. Use arrow keys to navigate and
          Enter to select.
        </div>
        <div className="mt-5">
          <Editor />
        </div>
      </div>
    </div>
  );
}

export default App;
