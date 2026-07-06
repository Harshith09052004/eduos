import DepartmentRow from "./DepartmentRow";

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
  onEdit: (department: Department) => void;
  onDelete: (id: number) => void;
}

export default function DepartmentTable({
  departments,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Department</th>
              <th className="px-4 py-3 text-left">HOD</th>
              <th className="px-4 py-3 text-left">Students</th>
              <th className="px-4 py-3 text-left">Faculty</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {departments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-slate-500"
                >
                  No departments found.
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <DepartmentRow
                  key={department.id}
                  department={department}
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