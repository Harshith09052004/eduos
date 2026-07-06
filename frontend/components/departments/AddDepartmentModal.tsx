"use client";

import { useEffect, useState } from "react";
import {
  createDepartment,
  updateDepartment,
} from "@/services/department";

type Department = {
  id: number;
  name: string;
  code: string;
  hod: string;
  total_students: number;
  total_faculty: number;
};

interface Props {
  open: boolean;
  onClose: () => void;
  department: Department | null;
}

const emptyForm = {
  name: "",
  code: "",
  hod: "",
  total_students: 0,
  total_faculty: 0,
};

export default function AddDepartmentModal({
  open,
  onClose,
  department,
}: Props) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (department) {
      setForm({
        name: department.name ?? "",
        code: department.code ?? "",
        hod: department.hod ?? "",
        total_students: department.total_students ?? 0,
        total_faculty: department.total_faculty ?? 0,
      });
    } else {
      setForm(emptyForm);
    }
  }, [department, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "total_students" ||
        name === "total_faculty"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (department) {
        await updateDepartment(department.id, form);
        alert("Department updated successfully!");
      } else {
        await createDepartment(form);
        alert("Department added successfully!");
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
      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-2xl font-bold">
          {department ? "Edit Department" : "Add Department"}
        </h2>

        <div className="grid gap-4">

          <input
            name="name"
            placeholder="Department Name"
            value={form.name}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="code"
            placeholder="Department Code"
            value={form.code}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            name="hod"
            placeholder="Head of Department"
            value={form.hod}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            name="total_students"
            placeholder="Total Students"
            value={form.total_students}
            onChange={handleChange}
            className="rounded border p-3"
          />

          <input
            type="number"
            name="total_faculty"
            placeholder="Total Faculty"
            value={form.total_faculty}
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
            {department ? "Update Department" : "Save Department"}
          </button>

        </div>

      </div>
    </div>
  );
}