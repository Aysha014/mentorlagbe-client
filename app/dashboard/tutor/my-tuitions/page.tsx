
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { token } from "@/lib/auth-client";
import {
  BookOpen,
  Edit,
  Trash2,
  X,
  Loader2,
  RefreshCw,
  MapPin,
  CalendarDays,
  Users,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Tuition {
   id: string;
  _id?: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location?: string;
  salary: number;
  daysPerWeek: number;
  schedule?: string;
  description: string;
  bannerImage?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  status: "active" | "closed";
  createdAt: string;
}

const emptyForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "",
  location: "",
  salary: "",
  daysPerWeek: "",
  schedule: "",
  description: "",
};

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState("");
  const [editingTuition, setEditingTuition] = useState<Tuition | null>(null);
  const [form, setForm] = useState(emptyForm);

  const getToken = async () => {
    const result = await token();

    if (result.error || !result.data?.token) {
      throw new Error("Authentication failed. Please sign in again.");
    }

    return result.data.token;
  };

  const fetchTuitions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) {
        throw new Error("API URL is not configured.");
      }

      const jwt = await getToken();

      const response = await fetch(`${API_URL}/tutor/tuitions`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response. Check the backend.");
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load tuition posts.");
      }

      setTuitions(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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

  const openEditModal = (tuition: Tuition) => {
    setEditingTuition(tuition);

    setForm({
      title: tuition.title || "",
      subject: tuition.subject || "",
      classLevel: tuition.classLevel || "",
      mode: tuition.mode || "",
      location: tuition.location || "",
      salary: String(tuition.salary ?? ""),
      daysPerWeek: String(tuition.daysPerWeek ?? ""),
      schedule: tuition.schedule || "",
      description: tuition.description || "",
    });

    setError("");
    setSuccess("");
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingTuition) return;

    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel ||
      !form.mode ||
      !form.salary ||
      !form.daysPerWeek ||
      !form.description.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (Number(form.salary) <= 0 || Number(form.daysPerWeek) <= 0) {
      setError("Fee and days per week must be greater than zero.");
      return;
    }

    setSaving(true);

    try {
      const jwt = await getToken();

      const response = await fetch(
        `${API_URL}/tutor/tuitions/${editingTuition.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            ...form,
            salary: Number(form.salary),
            daysPerWeek: Number(form.daysPerWeek),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update tuition.");
      }

      setEditingTuition(null);
      setSuccess(
        "Tuition updated successfully. It may require admin approval again."
      );

      await fetchTuitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (tuition: Tuition) => {
    setError("");
    setSuccess("");
    setActionId(tuition.id);

    try {
      const jwt = await getToken();
      const newStatus = tuition.status === "active" ? "closed" : "active";

      const response = await fetch(
        `${API_URL}/tutor/tuitions/${tuition.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update status.");
      }

      setSuccess(`Tuition marked as ${newStatus}.`);
      await fetchTuitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    } finally {
      setActionId("");
    }
  };

  const handleDelete = async (tuition: Tuition) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${tuition.title}"? Related applications will also be deleted.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setActionId(tuition.id);

    try {
      const jwt = await getToken();

      const response = await fetch(
        `${API_URL}/tutor/tuitions/${tuition.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete tuition.");
      }

      setSuccess("Tuition deleted successfully.");
      await fetchTuitions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setActionId("");
    }
  };

  const approvalStyle = (status: Tuition["approvalStatus"]) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">
            Tutor Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Tuitions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your tuition posts and track their approval status.
          </p>
        </div>

        <button
          onClick={fetchTuitions}
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

      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <Loader2 size={30} className="animate-spin text-teal-700" />
        </div>
      ) : tuitions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
          <BookOpen size={38} className="mx-auto text-slate-400" />
          <h2 className="mt-4 text-lg font-semibold text-slate-800">
            No tuition posts yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Your tuition posts will appear here after you create them.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tuitions.map((tuition) => (
            <article
              key={tuition.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {tuition.bannerImage ? (
                <img
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-teal-50 text-teal-700">
                  <BookOpen size={38} />
                </div>
              )}

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${approvalStyle(
                      tuition.approvalStatus
                    )}`}
                  >
                    {tuition.approvalStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      tuition.status === "active"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tuition.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {tuition.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {tuition.subject} · {tuition.classLevel}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <BookOpen size={16} className="text-teal-700" />
                    {tuition.mode}
                  </p>

                  {tuition.location && (
                    <p className="flex items-center gap-2">
                      <MapPin size={16} className="text-teal-700" />
                      {tuition.location}
                    </p>
                  )}

                  <p className="flex items-center gap-2">
                    <CalendarDays size={16} className="text-teal-700" />
                    {tuition.daysPerWeek} days per week
                  </p>

                  <p className="flex items-center gap-2">
                    <Users size={16} className="text-teal-700" />
                    Monthly fee: ৳{Number(tuition.salary).toLocaleString()}
                  </p>
                </div>

                <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                  {tuition.description}
                </p>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => openEditModal(tuition)}
                    disabled={!!actionId}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Edit size={15} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleStatusChange(tuition)}
                    disabled={!!actionId}
                    className="rounded-lg bg-teal-50 px-3 py-2.5 text-sm font-medium text-teal-700 hover:bg-teal-100 disabled:opacity-50"
                  >
                    {actionId === tuition.id
                      ? "Please wait..."
                      : tuition.status === "active"
                        ? "Close Tuition"
                        : "Activate"}
                  </button>

                  <button
                    onClick={() => handleDelete(tuition)}
                    disabled={!!actionId}
                    className="col-span-2 flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={15} />
                    Delete Tuition
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingTuition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Tuition
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your tuition information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingTuition(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close edit form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Tuition title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />

                <input
                  required
                  placeholder="Subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />

                <select
                  required
                  value={form.classLevel}
                  onChange={(e) =>
                    setForm({ ...form, classLevel: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">Select class</option>
                  {[
                    "Class 1-5",
                    "Class 6-8",
                    "Class 9-10",
                    "SSC",
                    "HSC",
                    "Admission",
                    "University",
                    "Other",
                  ].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <select
                  required
                  value={form.mode}
                  onChange={(e) =>
                    setForm({ ...form, mode: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">Select mode</option>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>

                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />

                <input
                  required
                  type="number"
                  min="1"
                  placeholder="Monthly fee"
                  value={form.salary}
                  onChange={(e) =>
                    setForm({ ...form, salary: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />

                <select
                  required
                  value={form.daysPerWeek}
                  onChange={(e) =>
                    setForm({ ...form, daysPerWeek: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
                >
                  <option value="">Days per week</option>
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <option key={day} value={day}>
                      {day} days
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Preferred schedule"
                  value={form.schedule}
                  onChange={(e) =>
                    setForm({ ...form, schedule: e.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />

                <textarea
                  required
                  rows={4}
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
                />
              </div>

              <p className="text-xs text-amber-700">
                Editing an approved tuition may send it back for admin approval.
              </p>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingTuition(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
