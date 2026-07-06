"use client";

import { useEffect, useState } from "react";
import { createStudent, updateStudent } from "@/services/student";

type Student = {
  id: number;
  roll_no: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  section: string;
  attendance: number;
  cgpa: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  student?: Student | null;
};

export default function AddStudentModal({
  open,
  onClose,
  student,
}: Props) {
  const emptyForm = {
    roll_no: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "CSE",
    year: 1,
    section: "A",
    attendance: 0,
    cgpa: 0,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (student) {
      setForm({
        roll_no: student.roll_no,
        first_name: student.first_name,
        last_name: student.last_name,
        email: student.email,
        phone: student.phone,
        department: student.department,
        year: student.year,
        section: student.section,
        attendance: student.attendance,
        cgpa: student.cgpa,
      });
    } else {
      setForm(emptyForm);
    }
  }, [student, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "year" ||
        name === "attendance" ||
        name === "cgpa"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (student) {
        await updateStudent(student.id, form);
        alert("Student updated successfully!");
      } else {
        await createStudent(form);
        alert("Student added successfully!");
      }

      setForm(emptyForm);

      onClose();

      window.location.reload();
    } catch (error: any) {
      console.error(error);

      if (error.response?.data) {
        alert(JSON.stringify(error.response.data));
      } else {
        alert("Operation failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-2xl font-bold">
          {student ? "Edit Student" : "Add Student"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="roll_no"
            placeholder="Roll Number"
            value={form.roll_no}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="IT">IT</option>
            <option value="MECH">MECH</option>
          </select>

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>

          <select
            name="section"
            value={form.section}
            onChange={handleChange}
            className="rounded border p-3"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <input
            type="number"
            name="attendance"
            placeholder="Attendance"
            value={form.attendance}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            step="0.1"
            name="cgpa"
            placeholder="CGPA"
            value={form.cgpa}
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
            {student ? "Update Student" : "Save Student"}
          </button>
        </div>
      </div>
    </div>
  );
}