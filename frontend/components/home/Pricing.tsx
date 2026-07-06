import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    price: "₹9,999",
    description: "Perfect for small colleges.",
    features: [
      "Up to 500 Students",
      "Attendance",
      "AI Assistant",
      "Faculty Portal",
    ],
    featured: false,
  },
  {
    name: "Professional",
    price: "₹24,999",
    description: "Best for growing institutions.",
    features: [
      "Unlimited Students",
      "Departments",
      "Analytics",
      "Placement Module",
      "Priority Support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For universities & large campuses.",
    features: [
      "Multi Campus",
      "Custom Integrations",
      "Dedicated Support",
      "Custom AI",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold">Simple Pricing</h2>
          <p className="mt-4 text-gray-600">
            Choose a plan that fits your institution.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 shadow-lg ${
                plan.featured
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <p className="mt-4 text-5xl font-bold">{plan.price}</p>

              <p className="mt-3 opacity-80">{plan.description}</p>

              <ul className="mt-8 space-y-3">
                {plan.features.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>

              <Button
                className="mt-10 w-full"
                variant={plan.featured ? "secondary" : "default"}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}