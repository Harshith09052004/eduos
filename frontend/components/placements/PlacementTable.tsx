import PlacementRow from "./PlacementRow";

type Placement = {
  id: number;
  company_name: string;
  role: string;
  package: number;
  placement_type: string;
  drive_date: string;
};

interface Props {
  placements: Placement[];
  onEdit: (placement: Placement) => void;
  onDelete: (id: number) => void;
}

export default function PlacementTable({
  placements,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Package (LPA)</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Drive Date</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {placements.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-8 text-center text-slate-500"
              >
                No placements found.
              </td>
            </tr>
          ) : (
            placements.map((placement) => (
              <PlacementRow
                key={placement.id}
                placement={placement}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}