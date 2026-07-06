export default function DashboardPreview() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold">
            A Single Dashboard for Everything
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Manage your entire college from one intelligent platform.
          </p>
        </div>

        <div className="rounded-3xl border bg-slate-100 p-8 shadow-2xl">

          <div className="grid gap-6 md:grid-cols-4">

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Attendance</h3>
              <p className="mt-4 text-4xl font-bold text-blue-600">92%</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Students</h3>
              <p className="mt-4 text-4xl font-bold">12,540</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Faculty</h3>
              <p className="mt-4 text-4xl font-bold">620</p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow">
              <h3 className="font-semibold">Placements</h3>
              <p className="mt-4 text-4xl font-bold text-green-600">94%</p>
            </div>

          </div>

          <div className="mt-8 rounded-2xl bg-white p-8 shadow">

            <h3 className="mb-6 text-2xl font-bold">
              AI Assistant
            </h3>

            <div className="rounded-xl bg-slate-100 p-6">

              <p className="font-medium">
                👋 Hi Harshith!
              </p>

              <p className="mt-4 text-gray-600">
                I can generate notes, quizzes, attendance reports,
                placement analytics and answer student questions.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}