
"use client";

import { useCallback, useEffect, useState } from "react";
import { token } from "@/lib/auth-client";
import {
  Users,
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CalendarDays,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Applicant {
    id: string;
  _id?: string;
  studentName?: string;
  studentEmail: string;
  phone?: string;
  preferredSchedule?: string;
  learningNote?: string;
  tuitionTitle: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export default function TutorApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionId, setActionId] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/tutor/applicants`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response. Check the backend.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load applicants.");
      }

      setApplicants(result.data || []);
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
      void fetchApplicants();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchApplicants]);

  const updateStatus = async (
    applicant: Applicant,
    status: "accepted" | "rejected"
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${status} this application?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setActionId(applicant.id);

    try {
      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/tutor/applications/${applicant.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update application.");
      }

      setSuccess(`Application ${status} successfully.`);
      await fetchApplicants();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Status update failed."
      );
    } finally {
      setActionId("");
    }
  };

  const filteredApplicants =
    filter === "all"
      ? applicants
      : applicants.filter((applicant) => applicant.status === filter);

  const pendingCount = applicants.filter(
    (applicant) => applicant.status === "pending"
  ).length;

  const acceptedCount = applicants.filter(
    (applicant) => applicant.status === "accepted"
  ).length;

  const rejectedCount = applicants.filter(
    (applicant) => applicant.status === "rejected"
  ).length;

  const statusStyle = (status: Applicant["status"]) => {
    switch (status) {
      case "accepted":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            Tutor Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            Applicants
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Review student applications and manage their status.
          </p>
        </div>

        <button
          onClick={fetchApplicants}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending",
            value: pendingCount,
            icon: Clock,
            color: "text-amber-700 bg-amber-50",
          },
          {
            label: "Accepted",
            value: acceptedCount,
            icon: CheckCircle,
            color: "text-green-700 bg-green-50",
          },
          {
            label: "Rejected",
            value: rejectedCount,
            icon: XCircle,
            color: "text-red-700 bg-red-50",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label} Applications</p>
                <div className={`rounded-xl p-3 ${item.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">
                {loading ? "..." : item.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Accepted", value: "accepted" },
          { label: "Rejected", value: "rejected" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === item.value
                ? "bg-teal-700 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Loader2 size={30} className="animate-spin text-teal-700" />
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <Users size={38} className="mx-auto text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No applicants found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Student applications for your tuition posts will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredApplicants.map((applicant) => (
            <article
              key={applicant.id}
              className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-lg font-bold text-teal-700">
                    {(applicant.studentName || applicant.studentEmail || "S")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-slate-900">
                      {applicant.studentName || "Student"}
                    </h2>
                    <p className="break-all text-xs text-slate-500">
                      {applicant.studentEmail}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(
                    applicant.status
                  )}`}
                >
                  {applicant.status}
                </span>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Applied for
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  {applicant.tuitionTitle || "Tuition"}
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-600">
                {applicant.phone && (
                  <p className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0 text-teal-700" />
                    {applicant.phone}
                  </p>
                )}

                <p className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-teal-700" />
                  <span className="break-all">
                    {applicant.studentEmail}
                  </span>
                </p>

                {applicant.preferredSchedule && (
                  <p className="flex items-center gap-3">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-teal-700"
                    />
                    {applicant.preferredSchedule}
                  </p>
                )}

                <p className="flex items-center gap-3">
                  <Clock size={16} className="shrink-0 text-teal-700" />
                  Applied: {formatDate(applicant.createdAt)}
                </p>
              </div>

              {applicant.learningNote && (
                <div className="rounded-xl border border-slate-100 p-4">
                  <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <MessageSquare size={15} />
                    Student Note
                  </p>
                  <p className="text-sm leading-6 text-slate-700">
                    {applicant.learningNote}
                  </p>
                </div>
              )}

              {applicant.status === "pending" && (
                <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => updateStatus(applicant, "accepted")}
                    disabled={!!actionId}
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionId === applicant.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(applicant, "rejected")}
                    disabled={!!actionId}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
