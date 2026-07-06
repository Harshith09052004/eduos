"use client";

import { useEffect, useState } from "react";
import {
  createPlacement,
  updatePlacement,
} from "@/services/placement";

type Placement = {
  id: number;
  company_name: string;
  role: string;
  package: number;
  placement_type: string;
  drive_date: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  placement: Placement | null;
}

export default function AddPlacementModal({
  open,
  onClose,
  placement,
}: Props) {
  const [company_name, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [packageValue, setPackageValue] = useState("");
  const [placement_type, setPlacementType] = useState("");
  const [drive_date, setDriveDate] = useState("");

  useEffect(() => {
    if (placement) {
      setCompanyName(placement.company_name ?? "");
      setRole(placement.role ?? "");
      setPackageValue(String(placement.package ?? ""));
      setPlacementType(placement.placement_type ?? "");
      setDriveDate(placement.drive_date ?? "");
    } else {
      setCompanyName("");
      setRole("");
      setPackageValue("");
      setPlacementType("");
      setDriveDate("");
    }
  }, [placement, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    try {
      const data = {
        company_name,
        role,
        package: Number(packageValue),
        placement_type,
        drive_date,
      };

      if (placement) {
        await updatePlacement(placement.id, data);
        alert("Placement updated successfully.");
      } else {
        await createPlacement(data);
        alert("Placement added successfully.");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to save placement.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">
          {placement ? "Edit Placement" : "Add Placement"}
        </h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Company Name"
            value={company_name}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="number"
            placeholder="Package (LPA)"
            value={packageValue}
            onChange={(e) => setPackageValue(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="text"
            placeholder="Placement Type"
            value={placement_type}
            onChange={(e) => setPlacementType(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

          <input
            type="date"
            value={drive_date}
            onChange={(e) => setDriveDate(e.target.value)}
            className="w-full rounded-lg border p-3"
          />

        </div>

        <div className="mt-6 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
          >
            {placement ? "Update Placement" : "Add Placement"}
          </button>

        </div>
      </div>
    </div>
  );
}