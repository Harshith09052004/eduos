const testimonials = [
  {
    name: "Principal",
    college: "ABC Engineering College",
    quote:
      "EduOS AI helped us digitize attendance and student management in weeks.",
  },
  {
    name: "Faculty",
    college: "XYZ Institute",
    quote:
      "The AI assistant saves hours every week by generating quizzes and notes.",
  },
  {
    name: "Student",
    college: "Tech Campus",
    quote:
      "Everything I need—from attendance to assignments—is in one place.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold">
            Loved by Colleges
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name + item.college}
              className="rounded-3xl border bg-slate-50 p-8 shadow"
            >
              <p className="italic text-gray-700">
                "{item.quote}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-500">{item.college}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}