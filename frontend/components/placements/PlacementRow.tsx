type Placement = {
  id: number;
  company: string;
  role: string;
  package: number;
  placement_date: string;
  student_name?: string;
  roll_no?: string;
};

interface Props {
  placement: Placement;
  onEdit: (placement: Placement) => void;
  onDelete: (id: number) => void;
}

export default function PlacementRow({
  placement,
  onEdit,
  onDelete,
}: Props) {
  return (
    <tr className="border-b hover:bg-slate-50">
      <td className="px-4 py-3 font-medium">{placement.company}</td>
      <td className="px-4 py-3">{placement.role}</td>
      <td className="px-4 py-3">₹ {placement.package} LPA</td>
      <td className="px-4 py-3">{placement.placement_date}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(placement)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(placement.id)}
            className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
