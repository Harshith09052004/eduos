export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-semibold">Harshith</p>
          <p className="text-sm text-gray-500">
            Super Admin
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          H 
        </div>
      </div>
    </header>
  );
}