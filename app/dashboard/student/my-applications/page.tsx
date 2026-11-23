
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  BookOpen,
  XCircle,
  Clock,
  GraduationCap,
} from "lucide-react";
import { token } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Application {
  id: string;
  tuitionId: string;
  preferredSchedule: string;
  status: string;
  createdAt: string;
  tuition: {
    id: string;
    title: string;
    monthlyFee: number;
    tutorName: string;
    tutorEmail: string;
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setError("");

      const tokenResult = await token();
      const accessToken = tokenResult.data?.token;

      if (!accessToken) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(`${API_URL}/student/applications`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load applications.");
      }

      setApplications(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const timer = setTimeout(() => {
    void fetchApplications();
  }, 0);

  return () => clearTimeout(timer);
}, []);

  const handleCancel = async (applicationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) return;

    try {
      setCancelling(applicationId);
      setError("");

      const tokenResult = await token();
      const accessToken = tokenResult.data?.token;

      if (!accessToken) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/student/applications/${applicationId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not cancel application.");
      }

      await fetchApplications();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setCancelling(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-teal-700">
          Student Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          My Applications
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage your tuition applications.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center">
          <BookOpen className="mx-auto text-gray-300" size={42} />

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            No applications yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Browse available tuitions and apply for one.
          </p>

          <Link
            href="/tuitions"
            className="mt-6 inline-flex rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Browse Tuitions
          </Link>
        </div>
      ) : (
        /* Applications */
        <div className="grid gap-5">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-teal-50 p-2 text-teal-700">
                      <GraduationCap size={20} />
                    </div>

                    <h2 className="text-lg font-bold text-gray-900">
                      {application.tuition?.title || "Tuition"}
                    </h2>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <p>
                      Tutor:{" "}
                      <span className="font-medium text-gray-700">
                        {application.tuition?.tutorName || "Not available"}
                      </span>
                    </p>

                    <p className="break-all">
                      Email:{" "}
                      {application.tuition?.tutorEmail || "Not available"}
                    </p>

                    <p>
                      Monthly Fee:{" "}
                      <span className="font-semibold text-gray-800">
                        ৳{application.tuition?.monthlyFee ?? "Not specified"}
                      </span>
                    </p>

                    <p>
                      Preferred Schedule:{" "}
                      <span className="font-medium text-gray-700">
                        {application.preferredSchedule || "Not specified"}
                      </span>
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(application.status || "pending")}`}
                >
                  {application.status || "Pending"}
                </span>
              </div>

              <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays size={17} />

                    Applied:{" "}
                    {application.createdAt
                      ? new Date(application.createdAt).toLocaleDateString()
                      : "Not available"}
                  </p>

                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={17} />

                    {application.preferredSchedule || "Schedule not provided"}
                  </p>
                </div>

                {application.status?.toLowerCase() === "pending" && (
                  <button
                    onClick={() => handleCancel(application.id)}
                    disabled={cancelling === application.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <XCircle size={17} />

                    {cancelling === application.id
                      ? "Cancelling..."
                      : "Cancel Application"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
