"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import StudentsPageClient from "@/components/students/StudentsPageClient";
import { getStudents } from "@/services/student";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents()
      .then(setStudents)
      .catch(() => setStudents([]))
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
            <StudentsPageClient students={students} />
          )}
        </main>
      </div>
    </div>
  );
}
