"use client";

import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = { name: string; href: string; roles: string[] };

const roleToDashboard: Record<string, string> = {
  SUPER_ADMIN: "/dashboard",
  COLLEGE_ADMIN: "/dashboard",
  FACULTY: "/faculty/dashboard",
  STUDENT: "/student/dashboard",
  PARENT: "/dashboard",
};

const allMenus: MenuItem[] = [
  { name: "Dashboard", href: "#", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT", "PARENT"] },
  { name: "Students", href: "/students", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"] },
  { name: "Faculty", href: "/faculty", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN"] },
  { name: "Departments", href: "/departments", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN"] },
  { name: "Attendance", href: "/attendance", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT"] },
  { name: "Placements", href: "/placements", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "STUDENT"] },
  { name: "Analytics", href: "/analytics", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"] },
  { name: "School Pulse", href: "/school-pulse", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY"] },
  { name: "Email Campaigns", href: "/email-campaigns", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN"] },
  { name: "AI Assistant", href: "/ai", roles: ["SUPER_ADMIN", "COLLEGE_ADMIN", "FACULTY", "STUDENT", "PARENT"] },
];

export default function Sidebar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(Cookies.get("role") || "STUDENT");
  }, []);

  const menus = role ? allMenus.filter((m) => m.roles.includes(role)) : allMenus;

  const handleLogout = () => {
    Cookies.remove("access");
    Cookies.remove("refresh");
    Cookies.remove("role");
    router.push("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white shadow-sm">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold text-blue-600">EduOS AI</h1>
      </div>

      <nav className="flex-1 p-4">
        {menus.map((item) => {
          const href = item.name === "Dashboard" && role
            ? roleToDashboard[role] || "/dashboard"
            : item.href;
          return (
            <Link
              key={item.name}
              href={href}
              className="mb-2 block rounded-lg px-4 py-3 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        {role && (
          <>
            <span className="block text-xs text-slate-400">{role.replace("_", " ")}</span>
            <button
              onClick={handleLogout}
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
