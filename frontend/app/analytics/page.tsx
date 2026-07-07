import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          <AnalyticsDashboard />
        </main>
      </div>
    </div>
  );
}
