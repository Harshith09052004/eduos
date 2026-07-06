"use client";

const prompts = [
  "Show me students below 75% attendance",
  "What are the placement statistics?",
  "How many faculty members do we have?",
  "Give me a summary of all departments",
  "List all students with their details",
];

interface Props {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-6 pb-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
