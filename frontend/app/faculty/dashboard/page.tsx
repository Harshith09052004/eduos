"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/app/dashboard/Sidebar";
import Header from "@/app/dashboard/Header";
import api from "@/services/api";

type Profile = {
  id: number;
  email: string;
  role: string;
  phone: string;
  profile: {
    type: string;
    name: string;
    employee_id: string;
    department: string;
    designation: string;
  } | null;
};

type StudentRecord = {
  id: number;
  roll_no: string;
  first_name: string;
  last_name: string;
  department: string;
  year: number;
  section: string;
  attendance: number;
  cgpa: number;
};

export default function FacultyDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [deptMap, setDeptMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      api.get("/accounts/profile/").then((r) => r.data),
      api.get("/students/").then((r) => r.data),
      api.get("/departments/").then((r) => r.data),
    ])
      .then(([profileData, studentData, deptData]) => {
        setProfile(profileData);
        const map: Record<string, string> = {};
        for (const d of deptData) {
          map[d.code] = d.name;
        }
        setDeptMap(map);
        const dept = profileData?.profile?.department;
        if (dept) {
          setStudents(
            studentData.filter((s: StudentRecord) => s.department === dept)
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const faculty = profile?.profile;
  const avgAttendance = students.length
    ? (students.reduce((s, st) => s + st.attendance, 0) / students.length).toFixed(1)
    : "0";
  const avgCgpa = students.length
    ? (students.reduce((s, st) => s + st.cgpa, 0) / students.length).toFixed(2)
    : "0";
  const atRisk = students.filter((s) => s.attendance < 75 || s.cgpa < 7.0).length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-800">
            Welcome, {faculty?.name || "Faculty"}
          </h2>
          <p className="mb-8 text-slate-500">
            {faculty?.designation} &bull; {deptMap[faculty?.department || ""] || faculty?.department}
          </p>

          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">My Department</h3>
              <p className="mt-3 text-3xl font-bold">{deptMap[faculty?.department || ""] || faculty?.department}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">Students</h3>
              <p className="mt-3 text-3xl font-bold">{students.length}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">Avg Attendance</h3>
              <p className="mt-3 text-3xl font-bold text-blue-600">{avgAttendance}%</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">At-Risk Students</h3>
              <p className={`mt-3 text-3xl font-bold ${atRisk > 0 ? "text-red-600" : "text-green-600"}`}>{atRisk}</p>
            </div>
          </div>

          <h3 className="mb-4 text-xl font-bold text-slate-800">
            Department Students ({students.length})
          </h3>
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4 font-medium">Roll No</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Year</th>
                  <th className="p-4 font-medium">Section</th>
                  <th className="p-4 font-medium">Attendance</th>
                  <th className="p-4 font-medium">CGPA</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">{s.roll_no}</td>
                    <td className="p-4">{s.first_name} {s.last_name}</td>
                    <td className="p-4 text-slate-600">{s.year}</td>
                    <td className="p-4 text-slate-600">{s.section}</td>
                    <td className={`p-4 ${s.attendance < 75 ? "text-red-600 font-medium" : "text-slate-600"}`}>
                      {s.attendance}%
                    </td>
                    <td className={`p-4 ${s.cgpa < 7.0 ? "text-red-600 font-medium" : "text-slate-600"}`}>
                      {s.cgpa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-800">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <a href="/students" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">All Students</a>
              <a href="/attendance" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">Attendance</a>
              <a href="/analytics" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">Analytics</a>
              <a href="/school-pulse" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">School Pulse</a>
              <a href="/ai" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">AI Assistant</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
