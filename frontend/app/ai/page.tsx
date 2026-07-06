import Sidebar from "@/app/dashboard/Sidebar";
import Header from "@/app/dashboard/Header";
import ChatWindow from "@/components/assistant/ChatWindow";

export default function AssistantPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}