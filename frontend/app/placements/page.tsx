"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import PlacementPageClient from "@/components/placements/PlacementPageClient";
import { getPlacements } from "@/services/placement";

export default function PlacementsPage() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacements()
      .then(setPlacements)
      .catch(() => setPlacements([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-8">
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : (
            <PlacementPageClient placements={placements} />
          )}
        </main>
      </div>
    </div>
  );
}
