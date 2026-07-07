"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import FacultyPageClient from "@/components/faculty/FacultyPageClient";
import { getFaculty } from "@/services/faculty";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFaculty()
      .then(setFaculty)
      .catch(() => setFaculty([]))
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
            <FacultyPageClient faculty={faculty} />
          )}
        </main>
      </div>
    </div>
  );
}
