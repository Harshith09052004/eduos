import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="flex min-h-[85vh] items-center justify-center bg-slate-50 px-6">
      <div className="mx-auto max-w-5xl text-center">

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          🚀 AI Powered College Ecosystem
        </span>

        <h1 className="mt-8 text-6xl font-extrabold leading-tight text-slate-900">
          The AI Operating System
          <br />
          for Modern Colleges
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-600">
          Attendance, Learning Management, Placements,
          Analytics and AI Assistant —
          all inside one intelligent platform.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Button size="lg">
            Get Started
          </Button>

          <Button variant="outline" size="lg">
            Book Demo
          </Button>
        </div>

      </div>
    </section>
  );
}