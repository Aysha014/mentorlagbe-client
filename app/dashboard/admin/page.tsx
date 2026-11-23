
"use client";

import { useCallback, useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  Users,
  GraduationCap,
  Clock,
  CheckCircle,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  pendingTuitions: number;
  approvedTuitions: number;
  totalRevenue: number;
}

const initialStats: AdminStats = {
  totalUsers: 0,
  totalTutors: 0,
  pendingTuitions: 0,
  approvedTuitions: 0,
  totalRevenue: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error(
          "Authentication token not found. Please sign in again."
        );
      }

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Server returned an invalid response.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to load admin statistics."
        );
      }

      setStats({
        totalUsers: result.data?.totalUsers ?? 0,
        totalTutors: result.data?.totalTutors ?? 0,
        pendingTuitions: result.data?.pendingTuitions ?? 0,
        approvedTuitions: result.data?.approvedTuitions ?? 0,
        totalRevenue: result.data?.totalRevenue ?? 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchStats();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchStats]);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Tutors",
      value: stats.totalTutors,
      icon: GraduationCap,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Pending Tuitions",
      value: stats.pendingTuitions,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Approved Tuitions",
      value: stats.approvedTuitions,
      icon: CheckCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Stripe Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US")}`,
      icon: DollarSign,
      color: "bg-teal-50 text-teal-600",
    },
  ];

  const totalTuitions =
    stats.pendingTuitions + stats.approvedTuitions;

  const pendingPercentage = totalTuitions
    ? (stats.pendingTuitions / totalTuitions) * 100
    : 0;

  const approvedPercentage = totalTuitions
    ? (stats.approvedTuitions / totalTuitions) * 100
    : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-teal-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Admin Overview
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your MentorLagbe platform.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {card.label}
                  </p>

                  <h2 className="mt-3 break-words text-3xl font-bold text-slate-900">
                    {loading ? "..." : card.value}
                  </h2>
                </div>

                <div className={`shrink-0 rounded-xl p-3 ${card.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tuition Approval Summary */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Tuition Approval Summary
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Pending */}
          <div>
            <div className="mb-2 flex justify-between gap-3 text-sm">
              <span className="font-medium text-slate-600">
                Pending approval
              </span>

              <span className="font-bold text-amber-600">
                {loading ? "..." : stats.pendingTuitions}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${pendingPercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Approved */}
          <div>
            <div className="mb-2 flex justify-between gap-3 text-sm">
              <span className="font-medium text-slate-600">
                Approved
              </span>

              <span className="font-bold text-green-600">
                {loading ? "..." : stats.approvedTuitions}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-green-500 transition-all duration-500"
                style={{
                  width: `${approvedPercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
