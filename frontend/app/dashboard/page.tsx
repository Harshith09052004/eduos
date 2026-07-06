import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import { getStudents } from "@/services/student";

export default async function Dashboard() {
  const students = await getStudents();

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <h2 className="mb-8 text-3xl font-bold text-slate-800">
            Welcome back 👋
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Students"
              value={students.length.toString()}
            />

            <StatCard
              title="Faculty"
              value="620"
            />

            <StatCard
              title="Attendance"
              value="92%"
            />

            <StatCard
              title="Placements"
              value="94%"
            />
          </div>
        </main>
      </div>
    </div>
  );
}