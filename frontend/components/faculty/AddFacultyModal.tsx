"use client";

import { useEffect, useState } from "react";
import {
  createFaculty,
  updateFaculty,
} from "@/services/faculty";

type Faculty = {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  faculty: Faculty | null;
}

const emptyForm = {
  employee_id: "",
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  qualification: "",
  experience: 0,
};

export default function AddFacultyModal({
  open,
  onClose,
  faculty,
}: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (faculty) {
      setForm({
        employee_id: faculty.employee_id ?? "",
        first_name: faculty.first_name ?? "",
        last_name: faculty.last_name ?? "",
        email: faculty.email ?? "",
        phone: faculty.phone ?? "",
        department: faculty.department ?? "",
        designation: faculty.designation ?? "",
        qualification: faculty.qualification ?? "",
        experience: faculty.experience ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [faculty, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "experience"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (faculty) {
        await updateFaculty(faculty.id, form);
        alert("Faculty updated successfully!");
      } else {
        await createFaculty(form);
        alert("Faculty added successfully!");
      }

      setForm(emptyForm);
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
      <div className="w-full max-w-3xl rounded-xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold">
          {faculty ? "Edit Faculty" : "Add Faculty"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">

          <input
            name="employee_id"
            placeholder="Employee ID"
            value={form.employee_id}
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

          <input
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="qualification"
            placeholder="Qualification"
            value={form.qualification}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={form.experience}
            onChange={handleChange}
            className="rounded border p-3"
          />

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={() => {
              setForm(emptyForm);
              onClose();
            }}
            className="rounded bg-gray-300 px-5 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            {faculty ? "Update Faculty" : "Save Faculty"}
          </button>

        </div>

      </div>
    </div>
  );
}