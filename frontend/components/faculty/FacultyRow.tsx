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
  faculty: Faculty;
  onEdit: (faculty: Faculty) => void;
  onDelete: (id: number) => void;
}

export default function FacultyRow({
  faculty,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="px-4 py-3">
        {faculty.employee_id}
      </td>

      <td className="px-4 py-3 font-medium">
        {faculty.first_name} {faculty.last_name}
      </td>

      <td className="px-4 py-3">
        {faculty.department}
      </td>

      <td className="px-4 py-3">
        {faculty.designation}
      </td>

      <td className="px-4 py-3">
        {faculty.qualification}
      </td>

      <td className="px-4 py-3">
        {faculty.experience} yrs
      </td>

      <td className="px-4 py-3">
        {faculty.email}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(faculty)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(faculty.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}