import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import FacultyPageClient from "@/components/faculty/FacultyPageClient";
import { getFaculty } from "@/services/faculty";

export default async function FacultyPage() {
  const faculty = await getFaculty();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <FacultyPageClient faculty={faculty} />
        </main>
      </div>
    </div>
  );
}