"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login, getRoleFromToken } from "@/services/auth";

type RoleTab = "admin" | "faculty" | "student";

const roleConfig: Record<RoleTab, { label: string; icon: string; placeholder: string; btnColor: string }> = {
  admin: { label: "Admin", icon: "🔐", placeholder: "Email", btnColor: "bg-purple-600 hover:bg-purple-700" },
  faculty: { label: "Faculty", icon: "👨‍🏫", placeholder: "Employee ID", btnColor: "bg-blue-600 hover:bg-blue-700" },
  student: { label: "Student", icon: "👨‍🎓", placeholder: "Roll Number", btnColor: "bg-green-600 hover:bg-green-700" },
};

const roleRedirects: Record<string, string> = {
  SUPER_ADMIN: "/dashboard",
  COLLEGE_ADMIN: "/dashboard",
  FACULTY: "/faculty/dashboard",
  STUDENT: "/student/dashboard",
  PARENT: "/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<RoleTab>("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await login(loginId, password);

      Cookies.set("access", data.access, { expires: 1 });
      Cookies.set("refresh", data.refresh, { expires: 7 });

      const role = getRoleFromToken(data.access);
      if (role) {
        Cookies.set("role", role, { expires: 1 });
      }

      const redirect = roleRedirects[role as string] || "/dashboard";
      router.push(redirect);
    } catch {
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = roleConfig[tab];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-lg">
        <h1 className="mb-8 text-center text-4xl font-bold text-slate-800">EduOS</h1>

        <div className="mb-6 grid grid-cols-3 gap-3">
          {(Object.keys(roleConfig) as RoleTab[]).map((key) => {
            const c = roleConfig[key];
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => { setTab(key); setError(""); }}
                className={`rounded-xl p-4 text-center transition ${
                  isActive
                    ? "bg-white shadow-lg ring-2 ring-blue-500"
                    : "bg-white/70 hover:bg-white hover:shadow"
                }`}
              >
                <span className="text-2xl">{c.icon}</span>
                <p className={`mt-1 text-sm font-semibold ${isActive ? "text-blue-600" : "text-slate-600"}`}>
                  {c.label}
                </p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
          )}

          <input
            type="text"
            placeholder={cfg.placeholder}
            className="mb-4 w-full rounded-lg border p-3"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="mb-6 w-full rounded-lg border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full rounded-lg p-3 font-semibold text-white disabled:opacity-50 ${cfg.btnColor}`}
          >
            {loading ? "Signing In..." : `Login as ${cfg.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
