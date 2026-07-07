"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import DepartmentPageClient from "@/components/departments/DepartmentPageClient";
import { getDepartments } from "@/services/department";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch(() => setDepartments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <DepartmentPageClient departments={departments} />
          )}
        </main>
      </div>
    </div>
  );
}
