
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  MapPin,
  Search,
  SlidersHorizontal,
  Wallet,
  X,
} from "lucide-react";

const tuitions = [
  {
    id: "1",
    title: "Experienced Mathematics Tutor Needed",
    subject: "Mathematics",
    classLevel: "Class 9-10",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 6000,
    daysPerWeek: 4,
    tutorName: "Rahim Ahmed",
  },
  {
    id: "2",
    title: "English Tutor for Cambridge Student",
    subject: "English",
    classLevel: "Class 6-8",
    mode: "Online",
    location: "Online",
    monthlyFee: 5000,
    daysPerWeek: 3,
    tutorName: "Nusrat Jahan",
  },
  {
    id: "3",
    title: "Physics and Chemistry Tutor",
    subject: "Science",
    classLevel: "Class 11-12",
    mode: "Offline",
    location: "Uttara, Dhaka",
    monthlyFee: 8000,
    daysPerWeek: 4,
    tutorName: "Hasan Mahmud",
  },
  {
    id: "4",
    title: "ICT Tutor for Class 9 Student",
    subject: "ICT",
    classLevel: "Class 9-10",
    mode: "Online",
    location: "Online",
    monthlyFee: 4000,
    daysPerWeek: 3,
    tutorName: "Sadia Islam",
  },
  {
    id: "5",
    title: "Primary School Mathematics Tutor",
    subject: "Mathematics",
    classLevel: "Class 1-5",
    mode: "Offline",
    location: "Mirpur, Dhaka",
    monthlyFee: 3500,
    daysPerWeek: 5,
    tutorName: "Tanvir Hasan",
  },
  {
    id: "6",
    title: "Biology Tutor for HSC Student",
    subject: "Biology",
    classLevel: "Class 11-12",
    mode: "Online",
    location: "Online",
    monthlyFee: 5500,
    daysPerWeek: 3,
    tutorName: "Farhana Akter",
  },
];

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

export default function TuitionsPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Subjects");
  const [classLevel, setClassLevel] = useState("All Classes");
  const [mode, setMode] = useState("All Modes");

  const filteredTuitions = useMemo(() => {
    return tuitions.filter((tuition) => {
      const searchTerm = search.trim().toLowerCase();

      const matchesSearch =
        tuition.title.toLowerCase().includes(searchTerm) ||
        tuition.subject.toLowerCase().includes(searchTerm) ||
        tuition.location.toLowerCase().includes(searchTerm);

      const matchesSubject =
        subject === "All Subjects" || tuition.subject === subject;

      const matchesClass =
        classLevel === "All Classes" || tuition.classLevel === classLevel;

      const matchesMode = mode === "All Modes" || tuition.mode === mode;

      return matchesSearch && matchesSubject && matchesClass && matchesMode;
    });
  }, [search, subject, classLevel, mode]);

  function clearFilters() {
    setSearch("");
    setSubject("All Subjects");
    setClassLevel("All Classes");
    setMode("All Modes");
  }

  const hasActiveFilters =
    search !== "" ||
    subject !== "All Subjects" ||
    classLevel !== "All Classes" ||
    mode !== "All Modes";

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FFF8EC]">
      {/* Hero section */}
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

          {/* Responsive search bar */}
          <div className="mt-7 flex w-full max-w-2xl items-center gap-2 rounded-2xl bg-white p-2.5 shadow-sm sm:mt-9 sm:gap-3 sm:p-3">
            <Search className="ml-2 h-5 w-5 shrink-0 text-[#147D75]" />

            <input
              type="text"
              placeholder="Search subject, title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main listing section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:py-16">
        {/* Heading */}
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
            {filteredTuitions.length} opportunities found
          </span>
        </div>

        {/* Filter panel */}
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
              onChange={(e) => setSubject(e.target.value)}
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
              onChange={(e) => setClassLevel(e.target.value)}
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
              onChange={(e) => setMode(e.target.value)}
              className="min-w-0 w-full rounded-xl border border-slate-200 bg-[#FFFDFC] px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-[#147D75] focus:ring-2 focus:ring-[#147D75]/10 sm:col-span-2 lg:col-span-1 sm:px-4"
            >
              <option value="All Modes">All Modes</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Tuition cards */}
        {filteredTuitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {filteredTuitions.map((tuition) => (
              <article
                key={tuition.id}
                className="group flex min-w-0 flex-col rounded-2xl border border-[#E5EAE5] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                {/* Category and mode */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="max-w-full rounded-full bg-[#DDF3ED] px-3 py-1.5 text-xs font-semibold text-[#147D75]">
                    {tuition.subject}
                  </span>

                  <span className="rounded-full bg-[#FFF1DC] px-3 py-1.5 text-xs font-semibold text-[#A56824]">
                    {tuition.mode}
                  </span>
                </div>

                {/* Title and tutor */}
                <div className="mt-5">
                  <h3 className="break-words text-base font-bold leading-7 text-[#243B53] transition group-hover:text-[#147D75] sm:text-lg">
                    {tuition.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Tutor: {tuition.tutorName}
                  </p>
                </div>

                {/* Tuition information */}
                <div className="mt-5 flex-1 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                  <div className="flex min-w-0 items-start gap-3">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#147D75]" />
                    <span className="break-words">{tuition.classLevel}</span>
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
                      ৳{tuition.monthlyFee.toLocaleString()} / month
                    </span>
                  </div>
                </div>

                {/* Details button */}
                <Link
                  href={`/tuitions/${tuition.id}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#147D75] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#10665F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#147D75]"
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-2xl border border-dashed border-[#B8D8CE] bg-white px-5 py-12 text-center sm:py-16">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF3ED]">
              <Search className="h-6 w-6 text-[#147D75]" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#243B53] sm:text-xl">
              No opportunities found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              We couldn&apos;t find any tuitions matching your search. Try changing
              your search terms or filters.
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
