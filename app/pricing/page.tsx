
import Link from "next/link";
import { Check, Crown, GraduationCap, BookOpen } from "lucide-react";

const plans = [
  {
    role: "Student",
    icon: GraduationCap,
    description: "Find the right tutor and get better learning opportunities.",
    proPrice: "$10",
    freeFeatures: [
      "Browse available tuitions",
      "Apply for tuition opportunities",
      "Track application status",
      "Basic student dashboard",
    ],
    proFeatures: [
      "Everything in Free",
      "Priority application visibility",
      "Unlimited tuition applications",
      "Premium support",
    ],
  },
  {
    role: "Tutor",
    icon: BookOpen,
    description: "Reach more students and grow your tutoring career.",
    proPrice: "$15",
    freeFeatures: [
      "Create up to 2 tuition posts",
      "Manage tuition applications",
      "View student applicants",
      "Basic tutor dashboard",
    ],
    proFeatures: [
      "Everything in Free",
      "Unlimited tuition posts",
      "Verified tutor badge",
      "Priority listing in search results",
      "Premium support",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#f8faf9] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
            <Crown size={28} />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-teal-700">
            Simple and transparent pricing
          </p>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Plans for Everyone
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Whether you&apos;re looking for a tutor or teaching students,
            choose a plan that works for you.
          </p>
        </div>

        <div className="mt-14 space-y-14">
          {plans.map((plan) => {
            const Icon = plan.icon;

            return (
              <section key={plan.role}>
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.role} Plans
                    </h2>
                    <p className="text-sm text-gray-500">
                      {plan.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900">
                      Free
                    </h3>

                    <div className="mt-5">
                      <span className="text-4xl font-bold text-gray-900">
                        $0
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        / forever
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Get started with MentorLagbe.
                    </p>

                    <div className="my-7 border-t border-gray-100" />

                    <ul className="space-y-4">
                      {plan.freeFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <Check
                            size={18}
                            className="shrink-0 text-teal-600"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/sign-in"
                      className="mt-8 block rounded-xl border border-teal-200 bg-teal-50 px-5 py-3 text-center text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
                    >
                      Get Started
                    </Link>
                  </div>

                  <div className="relative rounded-3xl border border-teal-600 bg-white p-7 shadow-sm ring-1 ring-teal-600">
                    <span className="absolute right-6 top-6 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                      Pro
                    </span>

                    <h3 className="text-xl font-bold text-gray-900">
                      Pro
                    </h3>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.proPrice}
                      </span>
                      <span className="text-sm text-gray-500">
                        /month
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                      Get more opportunities with Pro.
                    </p>

                    <div className="my-7 border-t border-gray-100" />

                    <ul className="space-y-4">
                      {plan.proFeatures.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <Check
                            size={18}
                            className="shrink-0 text-teal-600"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/sign-in"
                      className="mt-8 block rounded-xl bg-teal-700 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      Upgrade to Pro
                    </Link>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-center text-xs text-gray-400">
          Pro subscriptions are billed monthly through Stripe.
        </p>
      </div>
    </main>
  );
}
