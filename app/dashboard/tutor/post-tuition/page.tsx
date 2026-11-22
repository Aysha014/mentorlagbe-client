
"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { token } from "@/lib/auth-client";
import {
  BookOpen,
  Upload,
  ImagePlus,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function PostTuitionPage() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    classLevel: "",
    mode: "",
    location: "",
    salary: "",
    daysPerWeek: "",
    schedule: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!image) return "";

    if (!IMGBB_API_KEY) {
      throw new Error("ImgBB API key is not configured.");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error("Image upload failed. Please try again.");
      }

      return result.data.url;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !form.title.trim() ||
      !form.subject.trim() ||
      !form.classLevel ||
      !form.mode ||
      !form.salary ||
      !form.daysPerWeek ||
      !form.description.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.salary) <= 0 || Number(form.daysPerWeek) <= 0) {
      setError("Monthly fee and days per week must be greater than zero.");
      return;
    }

    if (!API_URL) {
      setError("API URL is not configured.");
      return;
    }

    setLoading(true);

    try {
      const { data: tokenData, error: tokenError } = await token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Authentication failed. Please sign in again.");
      }

      let bannerImage = "";

      if (image) {
        bannerImage = await uploadImage();
      }

      const response = await fetch(`${API_URL}/tuitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          subject: form.subject.trim(),
          classLevel: form.classLevel,
          mode: form.mode,
          location: form.location.trim(),
          salary: Number(form.salary),
          daysPerWeek: Number(form.daysPerWeek),
          schedule: form.schedule.trim(),
          description: form.description.trim(),
          bannerImage,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error("Invalid server response. Please check the backend.");
      }

      const result = await response.json();

      if (!response.ok) {
        if (result.code === "FREE_PLAN_LIMIT") {
          throw new Error(
            result.message || "Free plan allows only 2 tuition posts. Upgrade to Pro for unlimited posts."
          );
        }

        throw new Error(result.message || "Failed to post tuition.");
      }

      setMessage(
        "Tuition posted successfully! It is now waiting for admin approval."
      );

      setForm({
        title: "",
        subject: "",
        classLevel: "",
        mode: "",
        location: "",
        salary: "",
        daysPerWeek: "",
        schedule: "",
        description: "",
      });

      setImage(null);
      setPreview("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-semibold text-teal-700">
          Tutor Dashboard
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          Post a New Tuition
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Share your tuition requirements and connect with students.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <CheckCircle size={19} className="mt-0.5 shrink-0" />
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
            <BookOpen size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900">
              Tuition Information
            </h2>
            <p className="text-xs text-slate-500">
              Fields marked * are required
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tuition Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Experienced Chemistry Tutor for HSC"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Subject *
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="e.g. Mathematics"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Class Level *
            </label>
            <select
              name="classLevel"
              value={form.classLevel}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
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
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tuition Mode *
            </label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
            >
              <option value="">Select mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Dhanmondi, Dhaka"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Monthly Fee (৳) *
            </label>
            <input
              type="number"
              name="salary"
              value={form.salary}
              onChange={handleChange}
              min="1"
              required
              placeholder="e.g. 6000"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Days Per Week *
            </label>
            <select
              name="daysPerWeek"
              value={form.daysPerWeek}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-600"
            >
              <option value="">Select days</option>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} {day === 1 ? "day" : "days"}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Preferred Schedule
            </label>
            <input
              name="schedule"
              value={form.schedule}
              onChange={handleChange}
              placeholder="e.g. Saturday, Monday and Wednesday at 7 PM"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Describe the tuition requirements, subjects, expectations and other details..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <label className="mb-3 block text-sm font-medium text-slate-700">
            Banner Image
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition hover:border-teal-500 hover:bg-teal-50/40">
            {preview ? (
              <img
                src={preview}
                alt="Tuition banner preview"
                className="max-h-56 w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <ImagePlus size={32} className="mb-3 text-teal-700" />
                <span className="text-sm font-semibold text-slate-700">
                  Click to upload an image
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  JPG, PNG or WebP · Maximum 5 MB
                </span>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {image && (
            <p className="mt-2 text-xs text-slate-500">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-semibold">Approval Notice</p>
          <p className="mt-1">
            Your tuition post will remain pending until an administrator
            reviews and approves it.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading || uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {uploading ? "Uploading image..." : "Posting tuition..."}
            </>
          ) : (
            <>
              <Upload size={18} />
              Post Tuition
            </>
          )}
        </button>
      </form>
    </div>
  );
}
