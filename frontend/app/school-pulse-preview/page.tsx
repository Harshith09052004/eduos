import Link from "next/link";

export default function SchoolPulsePreview() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">E</div>
            <h1 className="text-xl font-bold text-slate-800">EduOS</h1>
          </Link>
          <Link href="/login" className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Login</Link>
        </div>
      </header>

      <section className="bg-gradient-to-br from-teal-600 to-emerald-700 py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">Preview</div>
          <h2 className="mb-4 text-4xl font-bold">School Pulse</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-teal-100">
            Real-time health score, department benchmarks, at-risk student detection, and placement insights — all powered by AI.
          </p>
          <Link href="/login" className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-teal-700 shadow-lg transition hover:bg-teal-50">
            Login to View Full Dashboard
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-teal-600">Features</span>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">What School Pulse Offers</h3>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: "❤️", title: "Health Score", desc: "AI-driven institutional health score based on attendance, academics, placements, and faculty metrics.", color: "from-teal-500 to-teal-600", bg: "bg-teal-50" },
              { icon: "⚠️", title: "At-Risk Detection", desc: "Identify students at risk of low performance or dropout with early warning indicators.", color: "from-amber-500 to-amber-600", bg: "bg-amber-50" },
              { icon: "📊", title: "Department Benchmarks", desc: "Compare department-wise performance on attendance, placements, and academic metrics.", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
              { icon: "🎯", title: "Placement Analytics", desc: "Track placement rates, company-wise stats, and unplaced senior students.", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
              { icon: "📈", title: "Trend Analysis", desc: "Visualize trends across attendance, CGPA, and placement performance over time.", color: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50" },
              { icon: "🤖", title: "AI Insights", desc: "Generate AI-powered reports and recommendations for institutional improvement.", color: "from-rose-500 to-rose-600", bg: "bg-rose-50" },
            ].map((f) => (
              <div key={f.title} className={`rounded-2xl ${f.bg} p-6 transition hover:shadow-md`}>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-xl text-white shadow-sm`}>{f.icon}</div>
                <h4 className="font-bold text-slate-800">{f.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="text-2xl font-bold text-slate-800">Ready to see your School Pulse?</h3>
          <p className="mt-2 text-slate-500">Login to access real-time data and AI-powered insights.</p>
          <Link href="/login" className="mt-6 inline-block rounded-xl bg-teal-600 px-8 py-3 font-semibold text-white transition hover:bg-teal-700">Login Now</Link>
        </div>
      </section>

      <footer className="border-t bg-slate-900 py-8 text-center text-sm text-slate-400">
        <p>EduOS — AI-Powered Education Management System</p>
      </footer>
    </div>
  );
}
