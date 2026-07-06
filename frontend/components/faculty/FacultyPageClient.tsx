"use client";

import { useMemo, useState } from "react";
import FacultyTable from "./FacultyTable";
import AddFacultyModal from "./AddFacultyModal";
import { deleteFaculty } from "@/services/faculty";

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
  faculty: Faculty[];
}

export default function FacultyPageClient({
  faculty,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] =
    useState<Faculty | null>(null);

  const [search, setSearch] = useState("");

  const filteredFaculty = useMemo(() => {
    const value = search.toLowerCase();

    return faculty.filter((f) => {
      return (
        f.employee_id.toLowerCase().includes(value) ||
        f.first_name.toLowerCase().includes(value) ||
        f.last_name.toLowerCase().includes(value) ||
        f.department.toLowerCase().includes(value) ||
        f.designation.toLowerCase().includes(value) ||
        f.email.toLowerCase().includes(value)
      );
    });
  }, [faculty, search]);

  const handleAdd = () => {
    setSelectedFaculty(null);
    setOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this faculty member?"
    );

    if (!confirmed) return;

    try {
      await deleteFaculty(id);

      alert("Faculty deleted successfully!");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete faculty.");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Faculty
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all faculty members.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Faculty
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search faculty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <FacultyTable
        faculty={filteredFaculty}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddFacultyModal
        open={open}
        onClose={handleClose}
        faculty={selectedFaculty}
      />
    </>
  );
}