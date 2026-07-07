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
    roll_no: string;
    department: string;
    year: number;
    section: string;
  } | null;
};

type AttendanceRecord = {
  id: number;
  roll_no: string;
  attendance_percentage: number;
  total_classes: number;
  classes_attended: number;
};

type PlacementRecord = {
  id: number;
  roll_no: string;
  company: string;
  role: string;
  package: number;
  placement_date: string;
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [placements, setPlacements] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [deptMap, setDeptMap] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([
      api.get("/accounts/profile/").then((r) => r.data),
      api.get("/attendance/").then((r) => r.data),
      api.get("/placements/").then((r) => r.data),
      api.get("/departments/").then((r) => r.data),
    ])
      .then(([profileData, attendanceData, placementData, deptData]) => {
        setProfile(profileData);
        const map: Record<string, string> = {};
        for (const d of deptData) {
          map[d.code] = d.name;
        }
        setDeptMap(map);
        const rollNo = profileData?.profile?.roll_no;
        if (rollNo) {
          const myAttendance = attendanceData.find(
            (a: AttendanceRecord) => a.roll_no === rollNo
          );
          setAttendance(myAttendance || null);
          setPlacements(
            placementData.filter((p: PlacementRecord) => p.roll_no === rollNo)
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

  const student = profile?.profile;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h2 className="mb-2 text-3xl font-bold text-slate-800">
            Welcome, {student?.name || "Student"}
          </h2>
          <p className="mb-8 text-slate-500">
            {deptMap[student?.department || ""] || student?.department} &bull; Year {student?.year} &bull; Section {student?.section}
          </p>

          <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">Roll Number</h3>
              <p className="mt-3 text-3xl font-bold">{student?.roll_no || "—"}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">Attendance</h3>
              <p className={`mt-3 text-3xl font-bold ${(attendance?.attendance_percentage || 0) < 75 ? "text-red-600" : "text-green-600"}`}>
                {attendance ? `${attendance.attendance_percentage}%` : "N/A"}
              </p>
              {attendance && (
                <p className="mt-1 text-sm text-slate-400">
                  {attendance.classes_attended} / {attendance.total_classes} classes
                </p>
              )}
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <h3 className="text-gray-500">Placements</h3>
              <p className="mt-3 text-3xl font-bold">{placements.length}</p>
              {placements.length > 0 && (
                <p className="mt-1 text-sm text-green-600">
                  Placed at {placements[0].company}
                </p>
              )}
            </div>
          </div>

          {placements.length > 0 && (
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-bold text-slate-800">My Placements</h3>
              <div className="overflow-x-auto rounded-xl bg-white shadow">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-4 font-medium">Company</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Package</th>
                      <th className="p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {placements.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="p-4 font-medium">{p.company}</td>
                        <td className="p-4 text-slate-600">{p.role}</td>
                        <td className="p-4 text-slate-600">₹{p.package} LPA</td>
                        <td className="p-4 text-slate-600">{new Date(p.placement_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-blue-50 p-6">
            <h3 className="mb-2 font-semibold text-blue-800">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <a href="/attendance" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">View Attendance</a>
              <a href="/placements" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">View Placements</a>
              <a href="/ai" className="rounded-lg bg-white px-4 py-2 text-sm text-blue-700 shadow-sm hover:bg-blue-100">AI Assistant</a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
