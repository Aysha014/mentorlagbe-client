
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { token } from "@/lib/auth-client";
import {
  Check,
  Crown,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TutorBillingPage() {
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBilling = async () => {
      try {
        const { data: tokenData, error: tokenError } = await token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(`${API_URL}/tutor/dashboard`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load billing details.");
        }

        setCurrentPlan(result.data?.currentPlan || "Free");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBilling();
  }, []);

  const isPro = currentPlan.toLowerCase() === "pro";

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/dashboard/tutor"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-teal-700"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
          Tutor Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Billing & Subscription
        </h1>
        <p className="mt-2 text-gray-500">
          Manage your tutor plan and subscription.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-gray-500">
          Loading billing details...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Your current plan
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                  {isPro ? <Crown size={25} /> : <GraduationCap size={25} />}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Tutor {isPro ? "Pro" : "Free"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isPro ? "$15/month subscription" : "No active paid subscription"}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  isPro
                    ? "bg-amber-100 text-amber-800"
                    : "bg-teal-100 text-teal-800"
                }`}
              >
                {isPro ? "Pro Member" : "Free Plan"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div
              className={`rounded-2xl border bg-white p-6 shadow-sm ${
                !isPro
                  ? "border-teal-500 ring-1 ring-teal-500"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-100 p-3 text-teal-700">
                  <GraduationCap size={23} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Free</h2>
              </div>

              <p className="mt-5 text-3xl font-bold text-gray-900">$0</p>
              <p className="mt-2 text-sm text-gray-500">Free forever</p>

              <div className="my-6 border-t border-gray-100" />

              <ul className="space-y-4">
                {[
                  "Create up to 2 tuition posts",
                  "Manage tuition applications",
                  "View student applicants",
                  "Basic tutor dashboard",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-gray-600"
                  >
                    <Check size={18} className="shrink-0 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {!isPro && (
                <div className="mt-8 rounded-xl bg-teal-50 px-4 py-3 text-center text-sm font-semibold text-teal-800">
                  Your Current Plan
                </div>
              )}
            </div>

            <div
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                isPro
                  ? "border-amber-500 ring-1 ring-amber-500"
                  : "border-gray-200"
              }`}
            >
              <span className="absolute right-5 top-5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Tutor Pro
              </span>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
                  <Crown size={23} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pro</h2>
              </div>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900">$15</span>
                <span className="text-sm text-gray-500">/month</span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Monthly recurring subscription
              </p>

              <div className="my-6 border-t border-gray-100" />

              <ul className="space-y-4">
                {[
                  "Everything in Free",
                  "Unlimited tuition posts",
                  "Verified tutor badge",
                  "Priority listing in search results",
                  "Premium support",
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm text-gray-600"
                  >
                    <Check size={18} className="shrink-0 text-teal-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isPro ? (
                <div className="mt-8 rounded-xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-800">
                  Your Current Plan
                </div>
              ) : (
                <button
                  disabled
                  className="mt-8 w-full cursor-not-allowed rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-500"
                >
                  Stripe Integration Coming Next
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
