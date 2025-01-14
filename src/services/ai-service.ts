// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateJoke(): Promise<string> {
  console.log("Generating joke..."); // Debug log

  // Simulate API call
  await delay(1000);

  const jokes = [
    "Why don't programmers like nature? It has too many bugs!",
    "Why did the JavaScript developer wear glasses? Because he couldn't C#!",
    "What's a programmer's favorite place? The Foo Bar!",
    "Why do programmers always mix up Christmas and Halloween? Because Oct 31 == Dec 25!",
    "What did the AI say to the other AI? 01001000 01101001!",
  ];

  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  console.log("Generated joke:", joke); // Debug log
  return joke;
}
