type Department = {
  id: number;
  name: string;
  code: string;
  hod: string;
  total_students: number;
  total_faculty: number;
};

interface Props {
  department: Department;
  onEdit: (department: Department) => void;
  onDelete: (id: number) => void;
}

export default function DepartmentRow({
  department,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="px-4 py-3 font-medium">
        {department.code}
      </td>

      <td className="px-4 py-3">
        {department.name}
      </td>

      <td className="px-4 py-3">
        {department.hod}
      </td>

      <td className="px-4 py-3">
        {department.total_students}
      </td>

      <td className="px-4 py-3">
        {department.total_faculty}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(department)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(department.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}