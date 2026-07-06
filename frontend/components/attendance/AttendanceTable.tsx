import AttendanceRow from "./AttendanceRow";

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
  attendance: Attendance[];
  onEdit: (attendance: Attendance) => void;
  onDelete: (id: number) => void;
}

export default function AttendanceTable({
  attendance,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Student</th>
              <th className="px-4 py-3 text-left">Attendance %</th>
              <th className="px-4 py-3 text-left">Total Classes</th>
              <th className="px-4 py-3 text-left">Classes Attended</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {attendance.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-500"
                >
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((record) => (
                <AttendanceRow
                  key={record.id}
                  attendance={record}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}