"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import AttendancePageClient from "@/components/attendance/AttendancePageClient";
import { getAttendance } from "@/services/attendance";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAttendance()
      .then(setAttendance)
      .catch(() => setAttendance([]))
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
            <AttendancePageClient attendance={attendance} />
          )}
        </main>
      </div>
    </div>
  );
}
