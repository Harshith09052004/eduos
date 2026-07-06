export default function TrustedBy() {
  const companies = [
    "AI Powered",
    "Cloud Ready",
    "Secure",
    "Multi Campus",
    "24/7 Support",
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-10 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Built for the Future of Education
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {companies.map((company) => (
            <div
              key={company}
              className="rounded-xl border border-gray-200 bg-slate-50 p-6 font-semibold text-gray-700 shadow-sm transition hover:shadow-lg"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}