"use client";

import { useMemo, useState } from "react";
import AttendanceTable from "./AttendanceTable";
import AddAttendanceModal from "./AddAttendanceModal";
import { deleteAttendance } from "@/services/attendance";

type Attendance = {
  id: number;
  student: number;
  roll_no: string;
  student_name: string;
  attendance_percentage: number;
  total_classes: number;
  classes_attended: number;
};

interface Props {
  attendance: Attendance[];
}

export default function AttendancePageClient({
  attendance,
}: Props) {
  const [open, setOpen] = useState(false);

  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null);

  const [search, setSearch] = useState("");

  const filteredAttendance = useMemo(() => {
    const value = search.toLowerCase();

    return attendance.filter((record) => {
      return (
        record.roll_no.toLowerCase().includes(value) ||
        record.student_name.toLowerCase().includes(value)
      );
    });
  }, [attendance, search]);

  const handleAdd = () => {
    setSelectedAttendance(null);
    setOpen(true);
  };

  const handleEdit = (record: Attendance) => {
    setSelectedAttendance(record);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this attendance record?")) return;

    try {
      await deleteAttendance(id);

      alert("Attendance deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete attendance.");
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Attendance
          </h1>

          <p className="mt-2 text-slate-500">
            Manage student attendance.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Attendance
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <AttendanceTable
        attendance={filteredAttendance}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddAttendanceModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedAttendance(null);
        }}
        attendance={selectedAttendance}
      />
    </>
  );
}