"use client";

import { useEffect, useState } from "react";
import {
  createAttendance,
  updateAttendance,
} from "@/services/attendance";
import { getStudents } from "@/services/student";

type Attendance = {
  id: number;
  student: number;
  roll_no: string;
  student_name: string;
  attendance_percentage: number;
  total_classes: number;
  classes_attended: number;
};

type Student = {
  id: number;
  roll_no: string;
  first_name: string;
  last_name: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  attendance?: Attendance | null;
}

export default function AddAttendanceModal({
  open,
  onClose,
  attendance,
}: Props) {
  const [students, setStudents] = useState<Student[]>([]);

  const [form, setForm] = useState({
    student: "",
    attendance_percentage: 0,
    total_classes: 0,
    classes_attended: 0,
  });

  useEffect(() => {
    if (!open) return;

    const loadStudents = async () => {
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();

    if (attendance) {
      setForm({
        student: String(attendance.student),
        attendance_percentage: attendance.attendance_percentage,
        total_classes: attendance.total_classes,
        classes_attended: attendance.classes_attended,
      });
    } else {
      setForm({
        student: "",
        attendance_percentage: 0,
        total_classes: 0,
        classes_attended: 0,
      });
    }
  }, [attendance, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "attendance_percentage" ||
        name === "total_classes" ||
        name === "classes_attended"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        student: Number(form.student),
        attendance_percentage: form.attendance_percentage,
        total_classes: form.total_classes,
        classes_attended: form.classes_attended,
      };

      if (attendance) {
        await updateAttendance(attendance.id, payload);
        alert("Attendance updated successfully!");
      } else {
        await createAttendance(payload);
        alert("Attendance added successfully!");
      }

      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Something went wrong.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold">
          {attendance ? "Edit Attendance" : "Add Attendance"}
        </h2>

        <div className="grid gap-4">
          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value="">Select Student</option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.roll_no} - {student.first_name}{" "}
                {student.last_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="attendance_percentage"
            placeholder="Attendance Percentage"
            value={form.attendance_percentage}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            name="total_classes"
            placeholder="Total Classes"
            value={form.total_classes}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            name="classes_attended"
            placeholder="Classes Attended"
            value={form.classes_attended}
            onChange={handleChange}
            className="rounded border p-3"
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-5 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            {attendance ? "Update Attendance" : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}