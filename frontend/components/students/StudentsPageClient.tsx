"use client";

import { useMemo, useState } from "react";
import StudentTable from "./StudentTable";
import AddStudentModal from "./AddStudentModal";
import { deleteStudent } from "@/services/student";

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

interface Props {
  students: Student[];
}

export default function StudentsPageClient({ students }: Props) {
  const [studentList, setStudentList] = useState<Student[]>(students);
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  const filteredStudents = useMemo(() => {
    const value = search.toLowerCase();

    return studentList.filter((student) => {
      return (
        student.roll_no.toLowerCase().includes(value) ||
        student.first_name.toLowerCase().includes(value) ||
        student.last_name.toLowerCase().includes(value) ||
        student.department.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value)
      );
    });
  }, [studentList, search]);

  const handleAdd = () => {
    setSelectedStudent(null);
    setOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setLoadingDelete(id);

      await deleteStudent(id);

      setStudentList((prev) =>
        prev.filter((student) => student.id !== id)
      );

      alert("Student deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete student.");
    } finally {
      setLoadingDelete(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Students
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all students in your college.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Student
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {loadingDelete !== null && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
          Deleting student...
        </div>
      )}

      <StudentTable
        students={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddStudentModal
        open={open}
        onClose={handleClose}
        student={selectedStudent}
      />
    </>
  );
}