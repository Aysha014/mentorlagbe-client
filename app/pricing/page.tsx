
import Link from "next/link";
import { Check, Crown, GraduationCap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "৳0",
    description: "Get started with MentorLagbe.",
    features: [
      "Browse available tuitions",
      "Apply for tuition opportunities",
      "Track application status",
      "Basic student dashboard",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "৳499",
    period: "/month",
    description: "Get more opportunities with Pro.",
    features: [
      "Everything in Free",
      "Priority application visibility",
      "Unlimited tuition applications",
      "Premium support",
    ],
    current: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#f8faf9] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <GraduationCap size={30} />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">
            Simple and transparent pricing
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Start with our Free plan or upgrade to Pro for additional
            opportunities.
          </p>
        </div>

        <div className="mt-12 grid gap-7 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-white p-7 shadow-sm ${
                plan.name === "Pro"
                  ? "border-teal-600 ring-1 ring-teal-600"
                  : "border-gray-200"
              }`}
            >
              {plan.name === "Pro" && (
                <span className="absolute right-6 top-6 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                  Popular
                </span>
              )}

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-xl p-3 ${
                    plan.name === "Pro"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-teal-100 text-teal-700"
                  }`}
                >
                  {plan.name === "Pro" ? (
                    <Crown size={23} />
                  ) : (
                    <GraduationCap size={23} />
                  )}
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {plan.name}
                </h2>
              </div>

              <div className="mt-7 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                {"period" in plan && (
                  <span className="text-sm text-gray-500">
                    {plan.period}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {plan.description}
              </p>

              <div className="my-7 border-t border-gray-100" />

              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <Check size={18} className="shrink-0 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <Link
                  href="/dashboard/student"
                  className="mt-8 block rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                >
                  Current Plan
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-8 w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-500"
                >
                  Upgrade Coming Soon
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          Pro payments will be available after payment gateway integration.
        </p>
      </div>
    </div>
  );
}
