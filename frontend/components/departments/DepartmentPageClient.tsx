"use client";

import { useMemo, useState } from "react";
import DepartmentTable from "./DepartmentTable";
import AddDepartmentModal from "./AddDepartmentModal";
import { deleteDepartment } from "@/services/department";

type Department = {
  id: number;
  name: string;
  code: string;
  hod: string;
  total_students: number;
  total_faculty: number;
};

interface Props {
  departments: Department[];
}

export default function DepartmentPageClient({
  departments,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [search, setSearch] = useState("");

  const filteredDepartments = useMemo(() => {
    const value = search.toLowerCase();

    return departments.filter((department) => {
      return (
        department.name.toLowerCase().includes(value) ||
        department.code.toLowerCase().includes(value) ||
        department.hod.toLowerCase().includes(value)
      );
    });
  }, [departments, search]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) return;

    try {
      await deleteDepartment(id);

      alert("Department deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete department.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Departments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all departments in your college.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <DepartmentTable
        departments={filteredDepartments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddDepartmentModal
        open={open}
        onClose={handleClose}
        department={selectedDepartment}
      />
    </>
  );
}