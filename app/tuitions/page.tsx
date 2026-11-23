
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const subjects = [
  "All Subjects",
  "Mathematics",
  "English",
  "Science",
  "ICT",
  "Biology",
];

const classLevels = [
  "All Classes",
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "Class 11-12",
];

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TuitionsPage() {
  const { data: session } = useSession();

  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [classLevel, setClassLevel] = useState("All Classes");
  const [mode, setMode] = useState("All Modes");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState("");

  const isStudent = session?.user?.role === "student";

  // Fetch tuition opportunities
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTuitions() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: String(page),
          limit: "9",
        });

        if (search.trim()) params.set("search", search.trim());
        if (subject !== "All Subjects") params.set("subject", subject);
        if (classLevel !== "All Classes") {
          params.set("classLevel", classLevel);
        }
        if (mode !== "All Modes") params.set("mode", mode);

        const response = await fetch(
          `${API_URL}/tuitions?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to load tuition opportunities.");
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Something went wrong.");
        }

        setTuitions(result.data || []);
        setPagination(result.pagination || null);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchTuitions();

    return () => controller.abort();
  }, [search, subject, classLevel, mode, page]);

  // Load student's saved bookmarks
  useEffect(() => {
    if (!isStudent) return;

    let cancelled = false;

    async function fetchBookmarks() {
      try {
        const tokenResult = await token();
        const accessToken = tokenResult.data?.token;

        if (!accessToken) return;

        const response = await fetch(`${API_URL}/student/bookmarks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) return;

        const result = await response.json();

        if (!cancelled && result.success) {
          setBookmarkedIds(
            (result.data || []).map((item: Tuition) => item.id)
          );
        }
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      }
    }

    fetchBookmarks();

    return () => {
      cancelled = true;
    };
  }, [isStudent]);

  // Add or remove a bookmark
  async function toggleBookmark(tuitionId: string) {
    if (!isStudent) return;

    try {
      setBookmarkLoadingId(tuitionId);

      const tokenResult = await token();
      const accessToken = tokenResult.data?.token;

      if (!accessToken) {
        toast.error("Please log in again to bookmark a tuition.");
        return;
      }

      const isBookmarked = bookmarkedIds.includes(tuitionId);

      const response = await fetch(
        `${API_URL}/student/bookmarks/${tuitionId}`,
        {
          method: isBookmarked ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || "Unable to update bookmark.");
        return;
      }

      setBookmarkedIds((current) =>
        isBookmarked
          ? current.filter((id) => id !== tuitionId)
          : [...current, tuitionId]
      );

      toast.success(
        isBookmarked
          ? "Bookmark removed successfully."
          : "Tuition bookmarked successfully."
      );
    } catch (err) {
      console.error("Bookmark error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookmarkLoadingId("");
    }
  }

  function clearFilters() {
    setSearch("");
    setSubject("All Subjects");
    setClassLevel("All Classes");
    setMode("All Modes");
    setPage(1);
  }

  const hasActiveFilters =
    search !== "" ||
    subject !== "All Subjects" ||
    classLevel !== "All Classes" ||
    mode !== "All Modes";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF8EC]">
      <section className="bg-[#DDF3ED] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#147D75] sm:text-sm">
              Explore opportunities
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-[#243B53] sm:text-4xl md:text-5xl">
              Find the right tuition for you.
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:mt-5 sm:text-base md:text-lg">
              Explore teaching opportunities and connect with students looking
              for the right tutor.
            </p>
          </div>

          <div className="mt-7 flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm sm:mt-9 sm:gap-3 sm:p-3">
            <Search className="ml-2 h-5 w-5 shrink-0 text-[#147D75]" />

            <input
              type="text"
              placeholder="Search subject or tuition title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#243B53] sm:text-2xl">
              Available Tuitions
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-slate-500">
              Explore opportunities that match your interests.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#DDF3ED] px-4 py-2 text-xs font-semibold text-[#147D75] sm:text-sm">
            {pagination?.total ?? 0} opportunities found
          </span>
        </div>

        <div className="mb-8 rounded-2xl border border-[#E5EAE5] bg-white p-4 shadow-sm sm:mb-9 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#243B53] sm:text-base">
              <SlidersHorizontal className="h-4 w-4 text-[#147D75]" />
              Filter opportunities
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              className="text-xs font-semibold text-[#147D75] transition hover:underline disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            >
              Clear filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <select
              aria-label="Filter by subject"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setPage(1);
              }}
              className="min-w-0 w-full rounded-xl border border-slate-200 bg-[#FFFDFC] px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#147D75] focus:ring-2 focus:ring-[#147D75]/10 sm:px-4"
            >
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by class level"
              value={classLevel}
              onChange={(e) => {
                setClassLevel(e.target.value);
                setPage(1);
              }}
              className="min-w-0 w-full rounded-xl border border-slate-200 bg-[#FFFDFC] px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#147D75] focus:ring-2 focus:ring-[#147D75]/10 sm:px-4"
            >
              {classLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter by learning mode"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setPage(1);
              }}
              className="min-w-0 w-full rounded-xl border border-slate-200 bg-[#FFFDFC] px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#147D75] focus:ring-2 focus:ring-[#147D75]/10 sm:col-span-2 lg:col-span-1 sm:px-4"
            >
              <option value="All Modes">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border border-[#E5EAE5] bg-white p-5"
              >
                <div className="h-6 w-24 rounded-full bg-slate-100" />
                <div className="mt-7 h-6 w-3/4 rounded bg-slate-100" />
                <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                <div className="mt-8 space-y-4">
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="h-4 w-3/4 rounded bg-slate-100" />
                  <div className="h-4 w-1/2 rounded bg-slate-100" />
                </div>
                <div className="mt-8 h-11 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-5 py-12 text-center">
            <h3 className="text-lg font-bold text-[#243B53]">
              Unable to load tuitions
            </h3>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => setPage((current) => current)}
              className="mt-5 rounded-xl bg-[#147D75] px-5 py-3 text-sm font-semibold text-white hover:bg-[#10665F]"
            >
              Try again
            </button>
          </div>
        ) : tuitions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {tuitions.map((tuition) => {
                const isBookmarked = bookmarkedIds.includes(tuition.id);
                const isBookmarkLoading =
                  bookmarkLoadingId === tuition.id;

                return (
                  <article
                    key={tuition.id}
                    className="group flex min-w-0 flex-col rounded-2xl border border-[#E5EAE5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="max-w-full rounded-full bg-[#DDF3ED] px-3 py-1.5 text-xs font-semibold text-[#147D75]">
                        {tuition.subject}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#FFF1DC] px-3 py-1.5 text-xs font-semibold text-[#A56824]">
                          {tuition.mode}
                        </span>

                        {isStudent && (
                          <button
                            type="button"
                            onClick={() => toggleBookmark(tuition.id)}
                            disabled={isBookmarkLoading}
                            aria-label={
                              isBookmarked
                                ? "Remove bookmark"
                                : "Bookmark tuition"
                            }
                            title={
                              isBookmarked
                                ? "Remove bookmark"
                                : "Save tuition"
                            }
                            className={`flex h-9 w-9 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              isBookmarked
                                ? "border-[#147D75] bg-[#DDF3ED] text-[#147D75]"
                                : "border-slate-200 bg-white text-slate-500 hover:border-[#147D75] hover:text-[#147D75]"
                            }`}
                          >
                            {isBookmarkLoading ? (
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Bookmark
                                className="h-4 w-4"
                                fill={isBookmarked ? "currentColor" : "none"}
                              />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="break-words text-base font-bold leading-7 text-[#243B53] transition group-hover:text-[#147D75] sm:text-lg">
                        {tuition.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500">
                        {tuition.tutorName
                          ? `Tutor: ${tuition.tutorName}`
                          : "Tutor details available"}
                      </p>
                    </div>

                    <div className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                      <div className="flex min-w-0 items-start gap-3">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                        <span className="break-words">
                          {tuition.classLevel}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                        <span className="break-words">{tuition.location}</span>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                        <span>{tuition.daysPerWeek} days per week</span>
                      </div>

                      <div className="flex min-w-0 items-start gap-3">
                        <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                        <span>
                          ৳
                          {(tuition.salary ?? tuition.monthlyFee ?? 0).toLocaleString()}{" "}
                          / month
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/tuitions/${tuition.id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#147D75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#10665F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147D75]"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                );
              })}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-xl border border-[#147D75] px-5 py-2.5 text-sm font-semibold text-[#147D75] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm font-medium text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-xl bg-[#147D75] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#B8D8CE] bg-white px-5 py-12 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF3ED]">
              <Search className="h-6 w-6 text-[#147D75]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#243B53] sm:text-xl">
              No opportunities found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              We couldn&apos;t find any tuitions matching your search. Try
              changing your search terms or filters.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-[#147D75] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10665F]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
