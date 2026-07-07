import Link from "next/link";

const sections = [
  { title: "Students", desc: "Manage student records, track performance, view profiles", href: "/students", color: "from-blue-500 to-blue-600" },
  { title: "Faculty", desc: "Faculty profiles, designations, department assignments", href: "/faculty", color: "from-purple-500 to-purple-600" },
  { title: "Departments", desc: "Department overview, HODs, faculty and student counts", href: "/departments", color: "from-amber-500 to-amber-600" },
  { title: "Attendance", desc: "Track attendance, identify defaulters, view trends", href: "/attendance", color: "from-green-500 to-green-600" },
  { title: "Placements", desc: "Placement records, company-wise stats, student tracking", href: "/placements", color: "from-rose-500 to-rose-600" },
  { title: "Analytics", desc: "Data-driven insights, charts, and performance metrics", href: "/analytics", color: "from-cyan-500 to-cyan-600" },
  { title: "School Pulse", desc: "AI-powered health score, risk analysis, department benchmarks", href: "/school-pulse", color: "from-teal-500 to-teal-600" },
  { title: "Email Campaigns", desc: "Bulk email campaigns with AI-generated content", href: "/email-campaigns", color: "from-indigo-500 to-indigo-600" },
  { title: "AI Assistant", desc: "Intelligent assistant with real-time database context", href: "/ai", color: "from-orange-500 to-orange-600" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-600">EduOS</h1>
          <div className="flex gap-4">
            <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Login</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-bold">AI-Powered Education Management</h2>
          <p className="mb-10 text-xl text-blue-100">
            Role-based dashboards, predictive analytics, smart insights, and an intelligent AI assistant — all in one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="rounded-xl bg-white px-8 py-3 font-semibold text-blue-700 shadow-lg hover:bg-blue-50">Get Started</Link>
            <Link href="/school-pulse" className="rounded-xl border border-white/30 px-8 py-3 font-semibold text-white hover:bg-white/10">View School Pulse</Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="mb-4 text-center text-3xl font-bold text-slate-800">All Modules</h3>
          <p className="mb-12 text-center text-slate-500">Every section is role-aware. Admins see everything; faculty and students see what matters to them.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link key={s.title} href={s.href} className="group rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className={`mb-4 h-2 w-12 rounded-full bg-gradient-to-r ${s.color}`} />
                <h4 className="mb-2 text-lg font-bold text-slate-800 group-hover:text-blue-600">{s.title}</h4>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h3 className="mb-12 text-center text-3xl font-bold text-slate-800">Role-Based Dashboards</h3>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border p-6 text-center">
              <span className="text-4xl">🔐</span>
              <h4 className="mt-4 text-lg font-bold text-slate-800">Admin</h4>
              <p className="mt-2 text-sm text-slate-500">Full access to all modules. Manage students, faculty, departments, attendance, placements, and more.</p>
            </div>
            <div className="rounded-2xl border p-6 text-center">
              <span className="text-4xl">👨‍🏫</span>
              <h4 className="mt-4 text-lg font-bold text-slate-800">Faculty</h4>
              <p className="mt-2 text-sm text-slate-500">View department students, track attendance, access analytics, and use AI insights.</p>
            </div>
            <div className="rounded-2xl border p-6 text-center">
              <span className="text-4xl">👨‍🎓</span>
              <h4 className="mt-4 text-lg font-bold text-slate-800">Student</h4>
              <p className="mt-2 text-sm text-slate-500">View your attendance, placements, and personal dashboard. Ask the AI assistant questions.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white py-8 text-center text-sm text-slate-400">
        EduOS — AI-Powered Education Management System
      </footer>
    </div>
  );
}
