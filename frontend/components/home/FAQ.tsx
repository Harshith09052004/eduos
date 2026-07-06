const faqs = [
  {
    question: "Can EduOS AI support multiple campuses?",
    answer:
      "Yes. EduOS AI is designed to manage multiple campuses from one dashboard.",
  },
  {
    question: "Does it include AI features?",
    answer:
      "Yes. AI can generate notes, quizzes, reports, placement insights, and answer student questions.",
  },
  {
    question: "Can we migrate existing student data?",
    answer:
      "Yes. CSV and Excel import will be supported.",
  },
  {
    question: "Is the platform mobile friendly?",
    answer:
      "Yes. EduOS AI works on desktops, tablets, and smartphones.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="mb-12 text-center text-5xl font-bold">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >
              <h3 className="text-xl font-semibold">
                {faq.question}
              </h3>

              <p className="mt-3 text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}