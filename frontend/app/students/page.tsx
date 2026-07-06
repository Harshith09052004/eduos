import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import StudentsPageClient from "@/components/students/StudentsPageClient";
import { getStudents } from "@/services/student";

export default async function StudentsPage() {
  let students = [];
  try { students = await getStudents(); } catch {}

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <StudentsPageClient students={students} />
        </main>
      </div>
    </div>
  );
}