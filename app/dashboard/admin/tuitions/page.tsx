
"use client";

import { useCallback, useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MapPin,
  CalendarDays,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Tuition {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location?: string;
  salary: number;
  daysPerWeek: number;
  description?: string;
  bannerImage?: string;
  tutorName?: string;
  tutorEmail?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  status: string;
  createdAt: string;
}

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const fetchTuitions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/admin/tuitions`, {
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
        throw new Error(result.message || "Failed to load tuition posts.");
      }

      setTuitions(result.data || []);
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
    void fetchTuitions();
  }, 0);

  return () => clearTimeout(timer);
}, [fetchTuitions]);

  const updateApproval = async (
    tuitionId: string,
    approvalStatus: "approved" | "rejected"
  ) => {
    const action = approvalStatus === "approved" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this tuition?`)) {
      return;
    }

    try {
      setUpdatingId(tuitionId);

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/admin/tuitions/${tuitionId}/approval`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ approvalStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update tuition.");
      }

      setTuitions((previous) =>
        previous.map((tuition) =>
          tuition.id === tuitionId
            ? { ...tuition, approvalStatus }
            : tuition
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setUpdatingId("");
    }
  };

  const pendingCount = tuitions.filter(
    (item) => item.approvalStatus === "pending"
  ).length;

  const approvedCount = tuitions.filter(
    (item) => item.approvalStatus === "approved"
  ).length;

  const rejectedCount = tuitions.filter(
    (item) => item.approvalStatus === "rejected"
  ).length;

  const statusStyle = (status: string) => {
    if (status === "approved") {
      return "bg-green-50 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            ADMINISTRATION
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Manage Tuitions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review and manage tuition posts submitted by tutors.
          </p>
        </div>

        <button
          onClick={fetchTuitions}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Pending Review"
          value={pendingCount}
          icon={<Clock size={21} />}
          color="amber"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<CheckCircle size={21} />}
          color="green"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={<XCircle size={21} />}
          color="red"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button
            onClick={fetchTuitions}
            className="ml-2 font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <BookOpen className="mx-auto text-slate-400" size={38} />
          <h3 className="mt-4 font-semibold text-slate-800">
            No tuition posts found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Tuition posts submitted by tutors will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {tuitions.map((tuition) => (
            <div
              key={tuition.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {tuition.bannerImage && (
                <div className="h-44 bg-slate-100">
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">
                      {tuition.title}
                    </h2>
                    <p className="mt-1 text-sm text-teal-700">
                      {tuition.subject} · {tuition.classLevel}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                      tuition.approvalStatus
                    )}`}
                  >
                    {tuition.approvalStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-800">
                      Monthly Fee
                    </span>
                    <br />
                    ৳{Number(tuition.salary || 0).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      Mode
                    </span>
                    <br />
                    {tuition.mode}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      Days/Week
                    </span>
                    <br />
                    {tuition.daysPerWeek}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-800">
                      Post Status
                    </span>
                    <br />
                    <span className="capitalize">{tuition.status}</span>
                  </p>
                </div>

                {tuition.location && (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={15} />
                    {tuition.location}
                  </p>
                )}

                {tuition.description && (
                  <p className="line-clamp-2 text-sm leading-6 text-slate-500">
                    {tuition.description}
                  </p>
                )}

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Tutor: {tuition.tutorName || "Not available"}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-500">
                    {tuition.tutorEmail || "Email not available"}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={14} />
                  Posted:{" "}
                  {tuition.createdAt
                    ? new Date(tuition.createdAt).toLocaleDateString()
                    : "Not available"}
                </div>

                {tuition.approvalStatus === "pending" && (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row">
                    <button
                      onClick={() =>
                        updateApproval(tuition.id, "approved")
                      }
                      disabled={updatingId === tuition.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      {updatingId === tuition.id ? "Updating..." : "Approve"}
                    </button>

                    <button
                      onClick={() =>
                        updateApproval(tuition.id, "rejected")
                      }
                      disabled={updatingId === tuition.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "green" | "red";
}) {
  const styles = {
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${styles[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
