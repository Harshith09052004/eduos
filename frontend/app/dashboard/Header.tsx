"use client";

import Cookies from "js-cookie";
import { decodeToken } from "@/services/auth";
import { useEffect, useState } from "react";

export default function Header() {
  const [userInfo, setUserInfo] = useState({ email: "", role: "", initial: "" });

  useEffect(() => {
    const token = Cookies.get("access");
    const payload = token ? decodeToken(token) : null;
    const email = payload?.email || "User";
    const role = Cookies.get("role") || "";
    setUserInfo({
      email,
      role,
      initial: email.charAt(0).toUpperCase(),
    });
  }, []);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold">{userInfo.email}</p>
          <p className="text-xs text-gray-500">{userInfo.role.replace("_", " ")}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          {userInfo.initial || "U"}
        </div>
      </div>
    </header>
  );
}
