"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import { getSchoolPulse, generateSchoolReport } from "@/services/schoolPulse";

type PulseData = {
  health_score: number;
  total_students: number;
  total_faculty: number;
  total_departments: number;
  avg_attendance: number;
  avg_cgpa: number;
  avg_experience: number;
  placement_rate: number;
  student_faculty_ratio: number;
  at_risk_count: number;
  at_risk_students: { name: string; roll_no: string; department: string; attendance: number; cgpa: number; risk_reason: string }[];
  unplaced_seniors: number;
  dept_stats: { name: string; code: string; student_count: number; placement_count: number; placement_rate: number }[];
};

function HealthGauge({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-500" : "text-red-500";
  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${color}`}>{score}</div>
      <p className="text-slate-500">out of 100</p>
      <div className="mt-2 h-4 w-full max-w-xs rounded-full bg-slate-200">
        <div
          className={`h-4 rounded-full transition-all ${
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-800">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export default function SchoolPulse() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    getSchoolPulse()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleGenerateReport = () => {
    setReport("");
    setReportLoading(true);
    generateSchoolReport(
      (token) => setReport((prev) => prev + token),
      () => setReportLoading(false),
      (err) => {
        setReport(`Error: ${err}`);
        setReportLoading(false);
      }
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading school pulse...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 space-y-8 p-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-slate-800">AI School Pulse</h2>
            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {reportLoading ? "Generating..." : "Generate AI Report"}
            </button>
          </div>

          {/* Health Score */}
          <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">School Health Score</h3>
            <HealthGauge score={data?.health_score ?? 0} />
          </div>

          {/* Stats */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Students" value={data?.total_students.toString() ?? "0"} />
            <StatCard label="Faculty" value={data?.total_faculty.toString() ?? "0"} sub={`Ratio: ${data?.student_faculty_ratio}:1`} />
            <StatCard label="Avg Attendance" value={`${data?.avg_attendance ?? 0}%`} />
            <StatCard label="Placement Rate" value={`${data?.placement_rate ?? 0}%`} />
            <StatCard label="Avg CGPA" value={data?.avg_cgpa.toString() ?? "0"} />
            <StatCard label="Avg Faculty Experience" value={`${data?.avg_experience ?? 0} yrs`} />
            <StatCard label="At-Risk Students" value={data?.at_risk_count.toString() ?? "0"} sub="Low attendance or CGPA" />
            <StatCard label="Unplaced Seniors" value={data?.unplaced_seniors.toString() ?? "0"} sub="Year 3+" />
          </div>

          {/* AI Report */}
          {report && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-slate-700">AI Intelligence Report</h3>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-slate-700">
                {report}
              </div>
            </div>
          )}

          {/* Department Stats */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-700">Department Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="pb-3 pr-4 font-medium">Department</th>
                    <th className="pb-3 pr-4 font-medium">Students</th>
                    <th className="pb-3 pr-4 font-medium">Placed</th>
                    <th className="pb-3 font-medium">Placement Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.dept_stats.map((d) => (
                    <tr key={d.code} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-800">{d.name}</td>
                      <td className="py-3 pr-4 text-slate-600">{d.student_count}</td>
                      <td className="py-3 pr-4 text-slate-600">{d.placement_count}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          d.placement_rate >= 50 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {d.placement_rate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* At-Risk Students */}
          {data && data.at_risk_students.length > 0 && (
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-red-600">
                ⚠ At-Risk Students ({data.at_risk_count})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium">Roll No</th>
                      <th className="pb-3 pr-4 font-medium">Dept</th>
                      <th className="pb-3 pr-4 font-medium">Attendance</th>
                      <th className="pb-3 pr-4 font-medium">CGPA</th>
                      <th className="pb-3 font-medium">Risk Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.at_risk_students.map((s) => (
                      <tr key={s.roll_no} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium text-slate-800">{s.name}</td>
                        <td className="py-3 pr-4 text-slate-600">{s.roll_no}</td>
                        <td className="py-3 pr-4 text-slate-600">{s.department}</td>
                        <td className="py-3 pr-4">
                          <span className={`font-medium ${s.attendance < 75 ? "text-red-600" : "text-green-600"}`}>
                            {s.attendance}%
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`font-medium ${s.cgpa < 7 ? "text-red-600" : "text-green-600"}`}>
                            {s.cgpa}
                          </span>
                        </td>
                        <td className="py-3 text-red-600">{s.risk_reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
