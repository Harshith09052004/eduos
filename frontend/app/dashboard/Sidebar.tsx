"use client";

import Link from "next/link";

const menu = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Students", href: "/students" },
  { name: "Faculty", href: "/faculty" },
  { name: "Departments", href: "/departments" },
  { name: "Attendance", href: "/attendance" },
  { name: "Placements", href: "/placements" },
  { name: "Analytics", href: "/analytics" },
  { name: "AI Assistant", href: "/ai" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white shadow-sm">
      {/* Logo */}
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-blue-600">
          EduOS AI
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="mb-2 block rounded-lg px-4 py-3 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}