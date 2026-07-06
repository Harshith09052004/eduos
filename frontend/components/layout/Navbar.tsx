"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EduOS AI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-gray-600 hover:text-blue-600">
            Features
          </a>

          <a href="#pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </a>

          <a href="#about" className="text-gray-600 hover:text-blue-600">
            About
          </a>

          <Button>Login</Button>
        </nav>
      </div>
    </header>
  );
}