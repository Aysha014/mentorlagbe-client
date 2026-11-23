
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  Clock3,
  MapPin,
  Wallet,
  ArrowRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { token, useSession } from "@/lib/auth-client";

interface Tuition {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  salary?: number;
  monthlyFee?: number;
  daysPerWeek: number;
  tutorName?: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function StudentBookmarksPage() {
  const { data: session, isPending } = useSession();

  const [bookmarks, setBookmarks] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");

  const isStudent = session?.user?.role === "student";

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);

      const tokenResult = await token();
      const accessToken = tokenResult.data?.token;

      if (!accessToken) {
        throw new Error("Please log in again.");
      }

      const response = await fetch(`${API_URL}/student/bookmarks`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load saved tuitions.");
      }

      setBookmarks(result.data || []);
    } catch (error) {
      console.error("Bookmark loading error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load saved tuitions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isPending) return;

    if (!isStudent) {
      setLoading(false);
      return;
    }

    fetchBookmarks();
  }, [isPending, isStudent, fetchBookmarks]);

  async function removeBookmark(tuitionId: string) {
    try {
      setRemovingId(tuitionId);

      const tokenResult = await token();
      const accessToken = tokenResult.data?.token;

      if (!accessToken) {
        toast.error("Please log in again.");
        return;
      }

      const response = await fetch(
        `${API_URL}/student/bookmarks/${tuitionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Unable to remove bookmark.");
        return;
      }

      setBookmarks((current) =>
        current.filter((item) => item.id !== tuitionId)
      );

      toast.success("Bookmark removed successfully.");
    } catch (error) {
      console.error("Remove bookmark error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setRemovingId("");
    }
  }

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#FFF8EC] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="h-9 w-56 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-white p-5"
              >
                <div className="h-6 w-24 rounded bg-gray-100" />
                <div className="mt-6 h-6 w-3/4 rounded bg-gray-100" />
                <div className="mt-5 space-y-4">
                  <div className="h-4 w-2/3 rounded bg-gray-100" />
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                  <div className="h-4 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!isStudent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFF8EC] px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#243B53]">
            Student access only
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Please sign in with a student account to view saved tuitions.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-[#147D75] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FFF8EC] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DDF3ED]">
                <Bookmark className="h-5 w-5 text-[#147D75]" />
              </div>

              <h1 className="text-2xl font-bold text-[#243B53] sm:text-3xl">
                Saved Tuitions
              </h1>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Keep track of tuition opportunities you are interested in.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#DDF3ED] px-4 py-2 text-sm font-semibold text-[#147D75]">
            {bookmarks.length} saved{" "}
            {bookmarks.length === 1 ? "tuition" : "tuitions"}
          </span>
        </div>

        {bookmarks.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {bookmarks.map((tuition) => (
              <article
                key={tuition.id}
                className="flex min-w-0 flex-col rounded-2xl border border-[#E5EAE5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="max-w-full rounded-full bg-[#DDF3ED] px-3 py-1.5 text-xs font-semibold text-[#147D75]">
                    {tuition.subject}
                  </span>

                  <span className="rounded-full bg-[#FFF1DC] px-3 py-1.5 text-xs font-semibold text-[#A56824]">
                    {tuition.mode}
                  </span>
                </div>

                <div className="mt-5">
                  <h2 className="break-words text-lg font-bold leading-7 text-[#243B53]">
                    {tuition.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {tuition.tutorName
                      ? `Tutor: ${tuition.tutorName}`
                      : "Tutor details available"}
                  </p>
                </div>

                <div className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                    <span className="break-words">{tuition.classLevel}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                    <span className="break-words">{tuition.location}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                    <span>{tuition.daysPerWeek} days per week</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                    <span>
                      ৳
                      {(tuition.salary ?? tuition.monthlyFee ?? 0).toLocaleString()}{" "}
                      / month
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Link
                    href={`/tuitions/${tuition.id}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#147D75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#10665F]"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeBookmark(tuition.id)}
                    disabled={removingId === tuition.id}
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Bookmark className="h-4 w-4" />
                    {removingId === tuition.id
                      ? "Removing..."
                      : "Remove Bookmark"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-[#B8D8CE] bg-white px-5 py-14 text-center sm:py-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#DDF3ED]">
              <Bookmark className="h-7 w-7 text-[#147D75]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#243B53]">
              No saved tuitions yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Browse available tuition opportunities and bookmark the ones
              you are interested in. They will appear here.
            </p>

            <Link
              href="/tuitions"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#147D75] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10665F]"
            >
              <Search className="h-4 w-4" />
              Browse Tuitions
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
