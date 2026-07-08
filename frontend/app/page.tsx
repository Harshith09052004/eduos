import Link from "next/link";

const sections = [
  { title: "Students", desc: "Manage student records, track performance, view profiles", href: "/students", icon: "🎓", gradient: "from-blue-500 to-blue-600", border: "hover:border-blue-200" },
  { title: "Faculty", desc: "Faculty profiles, designations, department assignments", href: "/faculty", icon: "👨‍🏫", gradient: "from-purple-500 to-purple-600", border: "hover:border-purple-200" },
  { title: "Departments", desc: "Department overview, HODs, faculty and student counts", href: "/departments", icon: "🏛️", gradient: "from-amber-500 to-amber-600", border: "hover:border-amber-200" },
  { title: "Attendance", desc: "Track attendance, identify defaulters, view trends", href: "/attendance", icon: "📋", gradient: "from-green-500 to-green-600", border: "hover:border-green-200" },
  { title: "Placements", desc: "Placement records, company-wise stats, student tracking", href: "/placements", icon: "💼", gradient: "from-rose-500 to-rose-600", border: "hover:border-rose-200" },
  { title: "Analytics", desc: "Data-driven insights, charts, and performance metrics", href: "/analytics", icon: "📊", gradient: "from-cyan-500 to-cyan-600", border: "hover:border-cyan-200" },
  { title: "School Pulse", desc: "AI-powered health score, risk analysis, department benchmarks", href: "/school-pulse", icon: "📡", gradient: "from-teal-500 to-teal-600", border: "hover:border-teal-200" },
  { title: "Email Campaigns", desc: "Bulk email campaigns with AI-generated content", href: "/email-campaigns", icon: "📧", gradient: "from-indigo-500 to-indigo-600", border: "hover:border-indigo-200" },
  { title: "AI Assistant", desc: "Intelligent assistant with real-time database context", href: "/ai", icon: "🤖", gradient: "from-orange-500 to-orange-600", border: "hover:border-orange-200" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">E</div>
            <h1 className="text-xl font-bold text-slate-800">EduOS</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/school-pulse-preview" className="text-sm font-medium text-slate-500 hover:text-blue-600">School Pulse</Link>
            <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Login</Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-28 text-white">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(59,130,246,0.5) 0%, transparent 50%)" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-block rounded-full bg-blue-500/20 px-4 py-1 text-sm font-medium text-blue-200">v2.0 — Now with AI</div>
          <h2 className="mb-6 text-5xl font-bold tracking-tight">AI-Powered Education Management</h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-200">
            Role-based dashboards, predictive analytics, smart insights, and an intelligent AI assistant — all in one platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="rounded-xl bg-white px-8 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-blue-50">Get Started</Link>
            <Link href="/school-pulse-preview" className="rounded-xl border border-white/30 bg-white/10 px-8 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20">View School Pulse</Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Modules</span>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">Everything You Need</h3>
            <p className="mt-2 text-slate-500">Every section is role-aware. Admins see everything; faculty and students see what matters to them.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all ${s.border} hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 transition group-hover:opacity-20`} />
                <div className="relative">
                  <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-lg">{s.icon}</span>
                  <div className={`mb-3 mt-3 h-1 w-10 rounded-full bg-gradient-to-r ${s.gradient}`} />
                  <h4 className="mb-1 text-lg font-bold text-slate-800">{s.title}</h4>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Access</span>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">Role-Based Dashboards</h3>
            <p className="mt-2 text-slate-500">Each role gets a tailored experience with relevant data and actions.</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: "🔐", title: "Admin", desc: "Full access to all modules — manage students, faculty, departments, attendance, placements, and more.", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
              { icon: "👨‍🏫", title: "Faculty", desc: "View department students, track attendance, access analytics, and use AI-powered insights.", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
              { icon: "👨‍🎓", title: "Student", desc: "View your attendance, placements, and personal dashboard. Ask the AI assistant questions.", color: "from-green-500 to-green-600", bg: "bg-green-50" },
            ].map((r) => (
              <div key={r.title} className={`group rounded-2xl ${r.bg} p-8 text-center transition hover:shadow-md`}>
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${r.color} text-2xl text-white shadow-sm`}>
                  {r.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-800">{r.title}</h4>
                <p className="mt-2 text-sm text-slate-500">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-600">Contact</span>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">Get In Touch</h3>
            <p className="mt-2 text-slate-500">Have questions or feedback? We&apos;d love to hear from you.</p>
          </div>
          <div className="mt-12 mx-auto max-w-2xl">
            <div className="grid gap-6 sm:grid-cols-3">
              <a href="mailto:podduturiharshith47@gmail.com" className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md block">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">📧</div>
                <h4 className="font-semibold text-slate-800">Email</h4>
                <p className="mt-1 text-sm text-slate-500">podduturiharshith47@gmail.com</p>
              </a>
              <a href="tel:+919154673116" className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md block">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">📞</div>
                <h4 className="font-semibold text-slate-800">Phone</h4>
                <p className="mt-1 text-sm text-slate-500">+91 9154673116</p>
              </a>
              <a href="https://github.com/Harshith09052004" target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white p-6 text-center shadow-sm transition hover:shadow-md block">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">🌐</div>
                <h4 className="font-semibold text-slate-800">GitHub</h4>
                <p className="mt-1 text-sm text-slate-500">Harshith09052004</p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-slate-900 py-10 text-center text-sm text-slate-400">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-xs font-bold text-white">E</div>
          <p className="mt-3">EduOS — AI-Powered Education Management System</p>
        </div>
      </footer>
    </div>
  );
}
