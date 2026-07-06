type Attendance = {
  id: number;
  student: number;
  roll_no: string;
  student_name: string;
  attendance_percentage: number;
  total_classes: number;
  classes_attended: number;
};

interface Props {
  attendance: Attendance;
  onEdit: (attendance: Attendance) => void;
  onDelete: (id: number) => void;
}

export default function AttendanceRow({
  attendance,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="px-4 py-3">{attendance.roll_no}</td>

      <td className="px-4 py-3 font-medium">
        {attendance.student_name}
      </td>

      <td className="px-4 py-3">
        {attendance.attendance_percentage}%
      </td>

      <td className="px-4 py-3">
        {attendance.total_classes}
      </td>

      <td className="px-4 py-3">
        {attendance.classes_attended}
      </td>

      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(attendance)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(attendance.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}