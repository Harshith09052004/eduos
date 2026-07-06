import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import DepartmentPageClient from "@/components/departments/DepartmentPageClient";
import { getDepartments } from "@/services/department";

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <DepartmentPageClient
            departments={departments}
          />
        </main>
      </div>
    </div>
  );
}