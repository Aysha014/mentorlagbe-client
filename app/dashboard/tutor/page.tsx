
"use client";

import { useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  BookOpen,
  Users,
  CheckCircle,
  Crown,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TutorStats {
  totalTuitions: number;
  activeTuitions: number;
  totalApplicants: number;
  currentPlan: string;
}

export default function TutorDashboard() {
  const [stats, setStats] = useState<TutorStats>({
    totalTuitions: 0,
    activeTuitions: 0,
    totalApplicants: 0,
    currentPlan: "Free",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError("");

        if (!API_URL) {
          throw new Error("API URL is not configured.");
        }

        // Get JWT from Better Auth
        const { data: tokenData, error: tokenError } = await token();

        if (tokenError || !tokenData?.token) {
          throw new Error(
            "Authentication token not found. Please sign in again."
          );
        }

        const jwt = tokenData.token;

        // Fetch tutor dashboard statistics
        const response = await fetch(`${API_URL}/tutor/dashboard`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        const contentType = response.headers.get("content-type");

        if (!contentType?.includes("application/json")) {
          throw new Error(
            "Server returned an invalid response. Check the backend API."
          );
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Failed to load tutor dashboard."
          );
        }

        if (!result.success) {
          throw new Error(
            result.message || "Unable to retrieve dashboard statistics."
          );
        }

        setStats({
          totalTuitions: result.data?.totalTuitions ?? 0,
          activeTuitions: result.data?.activeTuitions ?? 0,
          totalApplicants: result.data?.totalApplicants ?? 0,
          currentPlan: result.data?.currentPlan ?? "Free",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Tuition Posts",
      value: stats.totalTuitions,
      icon: BookOpen,
    },
    {
      label: "Active Tuitions",
      value: stats.activeTuitions,
      icon: CheckCircle,
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: Users,
    },
    {
      label: "Current Plan",
      value: stats.currentPlan,
      icon: Crown,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm font-medium text-teal-700">
          Tutor Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Welcome to your dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage your tuition posts and track your applicants.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-5 text-3xl font-bold text-slate-900">
                {loading ? "..." : card.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
