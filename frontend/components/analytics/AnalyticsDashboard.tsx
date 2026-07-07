"use client";

import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { getStudents } from "@/services/student";
import { getFaculty } from "@/services/faculty";
import { getDepartments } from "@/services/department";
import { getAttendance } from "@/services/attendance";
import { getPlacements } from "@/services/placement";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [students, faculty, departments, attendance, placements] = await Promise.all([
          getStudents(), getFaculty(), getDepartments(), getAttendance(), getPlacements(),
        ]);
        setData({ students, faculty, departments, attendance, placements });
      } catch {
        setData(null);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Loading charts...</div>;
  }

  if (!data) {
    return <div className="flex h-64 items-center justify-center text-slate-500">Could not load data. Make sure the backend is running.</div>;
  }

  const { students, faculty, departments, attendance, placements } = data;

  const deptLabels = departments.map((d: any) => d.name);
  const studentByDept = deptLabels.map((name: string) =>
    students.filter((s: any) => s.department === departments.find((d: any) => d.name === name)?.code).length
  );
  const facultyByDept = deptLabels.map((name: string) =>
    faculty.filter((f: any) => f.department === departments.find((d: any) => d.name === name)?.code).length
  );

  const ranges = ["0-25%", "25-50%", "50-75%", "75-100%"];
  const attendanceCounts = ranges.map((r) => {
    const [lo, hi] = r.split("-").map((v) => parseInt(v));
    return attendance.filter((a: any) => {
      const pct = parseFloat(a.attendance_percentage);
      return pct >= lo && pct <= hi;
    }).length;
  });

  const studentPieData = {
    labels: deptLabels,
    datasets: [{ data: studentByDept, backgroundColor: COLORS, borderColor: "#fff", borderWidth: 2 }],
  };

  const facultyBarData = {
    labels: deptLabels,
    datasets: [{ label: "Faculty", data: facultyByDept, backgroundColor: COLORS }],
  };

  const attendanceBarData = {
    labels: ranges,
    datasets: [{ label: "Students", data: attendanceCounts, backgroundColor: COLORS }],
  };

  const placedCount = placements.length;
  const unplacedCount = students.length - placedCount;
  const placementPieData = {
    labels: ["Placed", "Unplaced"],
    datasets: [{ data: [placedCount, unplacedCount], backgroundColor: ["#10b981", "#ef4444"], borderWidth: 2, borderColor: "#fff" }],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Students by Department</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Pie data={studentPieData} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Placement Status</h2>
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Pie data={placementPieData} />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Faculty by Department</h2>
          <Bar
            data={facultyBarData}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Attendance Distribution</h2>
          <Bar
            data={attendanceBarData}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-blue-50 p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{students.length}</p>
          <p className="text-sm text-slate-600">Total Students</p>
        </div>
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{faculty.length}</p>
          <p className="text-sm text-slate-600">Total Faculty</p>
        </div>
        <div className="rounded-xl bg-purple-50 p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{placements.length}</p>
          <p className="text-sm text-slate-600">Total Placements</p>
        </div>
      </div>
    </div>
  );
}
