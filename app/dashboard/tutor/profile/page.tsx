
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { token } from "@/lib/auth-client";
import { Loader2, Save, RefreshCw, UserRound } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TutorProfile {
  name: string;
  email: string;
  image: string;
  phone: string;
  bio: string;
  subjects: string;
  education: string;
  experience: string;
  location: string;
}

const emptyProfile: TutorProfile = {
  name: "",
  email: "",
  image: "",
  phone: "",
  bio: "",
  subjects: "",
  education: "",
  experience: "",
  location: "",
};

export default function TutorProfilePage() {
  const [profile, setProfile] = useState<TutorProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = async () => {
    const result = await token();

    if (result.error || !result.data?.token) {
      throw new Error("Authentication failed. Please sign in again.");
    }

    return result.data.token;
  };

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!API_URL) throw new Error("API URL is not configured.");

      const jwt = await getToken();

      const response = await fetch(`${API_URL}/tutor/profile`, {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load profile.");
      }

      setProfile({ ...emptyProfile, ...result.data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchProfile]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!profile.name.trim()) {
      setError("Name is required.");
      return;
    }

    setSaving(true);

    try {
      const jwt = await getToken();

      const response = await fetch(`${API_URL}/tutor/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: profile.name,
          image: profile.image,
          phone: profile.phone,
          bio: profile.bio,
          subjects: profile.subjects,
          education: profile.education,
          experience: profile.experience,
          location: profile.location,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update profile.");
      }

      setSuccess("Your profile has been updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof TutorProfile, value: string) => {
    setProfile((previous) => ({ ...previous, [field]: value }));
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 size={30} className="animate-spin text-teal-700" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-teal-700">Tutor Dashboard</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal information and teaching details.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <UserRound size={25} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Personal Information</h2>
            <p className="text-sm text-slate-500">
              Keep your profile accurate and up to date.
            </p>
          </div>
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

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name *
            </label>
            <input
              required
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>
            <input
              disabled
              value={profile.email}
              className={`${inputClass} cursor-not-allowed bg-slate-50`}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <input
              value={profile.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
              placeholder="Your phone number"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              className={inputClass}
              placeholder="City or area"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Profile Image URL
            </label>
            <input
              type="url"
              value={profile.image}
              onChange={(e) => updateField("image", e.target.value)}
              className={inputClass}
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              About Me
            </label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => updateField("bio", e.target.value)}
              className={inputClass}
              placeholder="Introduce yourself and your teaching approach..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subjects You Teach
            </label>
            <input
              value={profile.subjects}
              onChange={(e) => updateField("subjects", e.target.value)}
              className={inputClass}
              placeholder="Mathematics, Physics, English"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Educational Qualification
            </label>
            <input
              value={profile.education}
              onChange={(e) => updateField("education", e.target.value)}
              className={inputClass}
              placeholder="BSc in Mathematics"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Teaching Experience
            </label>
            <input
              value={profile.experience}
              onChange={(e) => updateField("experience", e.target.value)}
              className={inputClass}
              placeholder="e.g. 5 years of teaching experience"
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60 sm:w-auto"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
