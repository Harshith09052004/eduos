import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import AttendancePageClient from "@/components/attendance/AttendancePageClient";
import { getAttendance } from "@/services/attendance";

export default async function AttendancePage() {
  let attendance = [];
  try { attendance = await getAttendance(); } catch (_) {}

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <AttendancePageClient attendance={attendance} />
        </main>
      </div>
    </div>
  );
}