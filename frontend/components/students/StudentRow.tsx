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
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export default function StudentRow({
  student,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="px-4 py-3">{student.roll_no}</td>

      <td className="px-4 py-3 font-medium">
        {student.first_name} {student.last_name}
      </td>

      <td className="px-4 py-3">{student.department}</td>

      <td className="px-4 py-3">{student.year}</td>

      <td className="px-4 py-3">{student.section}</td>

      <td className="px-4 py-3">{student.cgpa}</td>

      <td className="px-4 py-3">
        {student.attendance}%
      </td>

      <td className="px-4 py-3">{student.email}</td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(student)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(student.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}