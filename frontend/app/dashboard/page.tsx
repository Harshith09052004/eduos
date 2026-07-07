"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StatCard from "./StatCard";
import { getStudents } from "@/services/student";
import { getFaculty } from "@/services/faculty";
import { getAttendance } from "@/services/attendance";
import { getPlacements } from "@/services/placement";

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, faculty: 0, attendance: "0%", placements: "0%" });

  useEffect(() => {
    Promise.all([
      getStudents().catch(() => []),
      getFaculty().catch(() => []),
      getAttendance().catch(() => []),
      getPlacements().catch(() => []),
    ]).then(([students, faculty, attendance, placements]) => {
      const avgAtt = attendance.length
        ? (attendance.reduce((s: number, a: any) => s + parseFloat(a.attendance_percentage || 0), 0) / attendance.length).toFixed(1) + "%"
        : "N/A";
      const placementRate = placements.length ? placements.length + " placed" : "N/A";
      setStats({
        students: students.length,
        faculty: faculty.length,
        attendance: avgAtt,
        placements: placementRate,
      });
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h2 className="mb-8 text-3xl font-bold text-slate-800">Welcome back</h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Students" value={stats.students.toString()} />
            <StatCard title="Faculty" value={stats.faculty.toString()} />
            <StatCard title="Attendance" value={stats.attendance} />
            <StatCard title="Placements" value={stats.placements} />
          </div>
        </main>
      </div>
    </div>
  );
}
