import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import PlacementPageClient from "@/components/placements/PlacementPageClient";
import { getPlacements } from "@/services/placement";

export default async function PlacementsPage() {
  let placements = [];
  try { placements = await getPlacements(); } catch (_) {}


  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-8">
          <PlacementPageClient placements={placements} />
        </main>
      </div>
    </div>
  );
}