export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-slate-200 px-4 py-3 shadow">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-500"></span>
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-500"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}