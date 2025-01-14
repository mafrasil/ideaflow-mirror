import Editor from "./components/Editor/Editor";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <Editor />
        </div>
      </div>
    </div>
  );
}

export default App;
