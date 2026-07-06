import {
  Brain,
  GraduationCap,
  ChartColumn,
  Briefcase,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Assistant",
    description: "Instant answers, notes, quizzes and academic support.",
  },
  {
    icon: GraduationCap,
    title: "Learning",
    description: "Assignments, courses, timetable and progress tracking.",
  },
  {
    icon: ChartColumn,
    title: "Analytics",
    description: "Student insights, attendance and performance reports.",
  },
  {
    icon: Briefcase,
    title: "Placements",
    description: "Resume builder, ATS scoring and mock interviews.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <h2 className="text-5xl font-bold">
            Everything Your College Needs
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            One platform. Endless possibilities.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-2 hover:shadow-xl"
            >
              <feature.icon
                className="mb-6 text-blue-600"
                size={40}
              />

              <h3 className="mb-4 text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="text-gray-600">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}