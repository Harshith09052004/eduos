"use client";

import { useMemo, useState } from "react";
import PlacementTable from "./PlacementTable";
import AddPlacementModal from "./AddPlacementModal";
import { deletePlacement } from "@/services/placement";

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
}

export default function PlacementPageClient({
  placements,
}: Props) {
  const [open, setOpen] = useState(false);

  const [selectedPlacement, setSelectedPlacement] =
    useState<Placement | null>(null);

  const [search, setSearch] = useState("");

  const filteredPlacements = useMemo(() => {
    const value = search.toLowerCase();

    return placements.filter((placement) => {
      return (
        placement.company_name.toLowerCase().includes(value) ||
        placement.role.toLowerCase().includes(value)
      );
    });
  }, [placements, search]);

  const handleAdd = () => {
    setSelectedPlacement(null);
    setOpen(true);
  };

  const handleEdit = (placement: Placement) => {
    setSelectedPlacement(placement);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this placement?")) return;

    try {
      await deletePlacement(id);

      alert("Placement deleted successfully.");

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete placement.");
    }
  };

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Placements
          </h1>

          <p className="mt-2 text-slate-500">
            Manage placement drives.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Placement
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      <PlacementTable
        placements={filteredPlacements}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddPlacementModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedPlacement(null);
        }}
        placement={selectedPlacement}
      />
    </>
  );
}