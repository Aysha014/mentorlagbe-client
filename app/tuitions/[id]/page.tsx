
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
  UserRound,
} from "lucide-react";
import { useSession, token } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Tuition {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location?: string;
  salary?: number;
  monthlyFee?: number;
  daysPerWeek?: number;
  schedule?: string;
  description?: string;
  bannerImage?: string;
  image?: string;
  tutorName?: string;
  tutorEmail?: string;
  tutorId?: string;
  tutor?: {
    name?: string;
    email?: string;
    image?: string;
    bio?: string;
  };
}

export default function TuitionDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session, isPending } = useSession();

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [learningNote, setLearningNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [applicationError, setApplicationError] = useState("");

  const user = session?.user as
    | { role?: string; name?: string; email?: string }
    | undefined;

  const role = user?.role;
  const isStudent = role === "student";

  useEffect(() => {
    async function fetchTuition() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/tuitions/${id}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load tuition.");
        }

        setTuition(result.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchTuition();
  }, [id]);

  async function handleApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setApplicationMessage("");
    setApplicationError("");

    try {
      const tokenResult = await token();
      const jwt = tokenResult.data?.token;

      if (!jwt) {
        throw new Error("Please sign in again to submit your application.");
      }

      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          tuitionId: id,
          phone,
          preferredSchedule,
          learningNote,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit application.");
      }

      setApplicationMessage("Your application has been submitted successfully!");
      setPhone("");
      setPreferredSchedule("");
      setLearningNote("");
    } catch (err) {
      setApplicationError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || isPending) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-muted-foreground">Loading tuition details...</p>
      </main>
    );
  }

  if (error || !tuition) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <BookOpen className="mx-auto mb-5 size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold sm:text-3xl">Tuition Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          {error || "This tuition is no longer available."}
        </p>
        <Link
          href="/tuitions"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Browse Tuitions
        </Link>
      </main>
    );
  }

  const fee = tuition.salary ?? tuition.monthlyFee ?? 0;
  const tutorName = tuition.tutor?.name || tuition.tutorName || "Tutor";
  const tutorEmail = tuition.tutor?.email || tuition.tutorEmail || "";
  const tutorImage = tuition.tutor?.image;
  const bannerImage = tuition.bannerImage || tuition.image;

  const details = [
    { icon: BookOpen, label: "Subject", value: tuition.subject },
    { icon: GraduationCap, label: "Class Level", value: tuition.classLevel },
    {
      icon: tuition.mode === "Online" ? Monitor : MapPin,
      label: "Teaching Mode",
      value: tuition.mode,
    },
    { icon: MapPin, label: "Location", value: tuition.location || "Not specified" },
    {
      icon: CalendarDays,
      label: "Days Per Week",
      value: tuition.daysPerWeek ? `${tuition.daysPerWeek} days` : "Not specified",
    },
    {
      icon: Clock,
      label: "Schedule",
      value: tuition.schedule || "To be discussed",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/tuitions"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Browse Tuitions
        </Link>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-7">
            <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              {bannerImage ? (
                <img
                  src={bannerImage}
                  alt={tuition.title}
                  className="h-48 w-full object-cover sm:h-64"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-primary/10 sm:h-52">
                  <BookOpen className="size-16 text-primary/50" />
                </div>
              )}

              <div className="p-5 sm:p-8">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {tuition.subject}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                    {tuition.mode}
                  </span>
                </div>

                <h1 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                  {tuition.title}
                </h1>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="size-4 text-primary" />
                    {tuition.classLevel}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    {tuition.location || "Location not specified"}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">Tuition Overview</h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {tuition.description || "No description provided."}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
                {details.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div
                      key={detail.label}
                      className="flex min-w-0 items-start gap-3 rounded-2xl bg-muted/60 p-4"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {detail.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">About the Tutor</h2>

              <div className="mt-5 flex items-center gap-4">
                {tutorImage ? (
                  <img
                    src={tutorImage}
                    alt={tutorName}
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <UserRound className="size-7" />
                  </div>
                )}

                <div className="min-w-0">
                  <h3 className="font-bold">{tutorName}</h3>
                  {tutorEmail && (
                    <p className="break-all text-sm text-muted-foreground">
                      {tutorEmail}
                    </p>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Tuition poster
                  </p>
                </div>
              </div>

              {tuition.tutor?.bio && (
                <p className="mt-4 leading-7 text-muted-foreground">
                  {tuition.tutor.bio}
                </p>
              )}
            </section>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Tuition Fee
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-1">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                  ৳{fee.toLocaleString("en-BD")}
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>

              <div className="my-6 border-t border-border" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="text-right font-semibold">{tuition.subject}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Class</span>
                  <span className="text-right font-semibold">{tuition.classLevel}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="text-right font-semibold">{tuition.mode}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Days/week</span>
                  <span className="text-right font-semibold">
                    {tuition.daysPerWeek || "Not specified"}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-border" />

              {!session ? (
                <>
                  <Link
                    href="/sign-in"
                    className="flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Sign In to Apply
                  </Link>
                  <p className="mt-4 text-center text-xs text-muted-foreground">
                    Sign in with a student account to apply.
                  </p>
                </>
              ) : !isStudent ? (
                <div className="rounded-xl bg-muted p-4 text-center">
                  <p className="font-semibold">Application unavailable</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Only students can apply for tuition. Your current role is{" "}
                    {role || "not specified"}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplication} className="space-y-4">
                  <h2 className="font-bold">Apply for this Tuition</h2>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Preferred Schedule
                    </label>
                    <input
                      type="text"
                      required
                      value={preferredSchedule}
                      onChange={(e) => setPreferredSchedule(e.target.value)}
                      placeholder="e.g. Sat & Mon, 5 PM"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Learning Note
                    </label>
                    <textarea
                      rows={4}
                      value={learningNote}
                      onChange={(e) => setLearningNote(e.target.value)}
                      placeholder="Tell the tutor about your learning goals..."
                      className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                    />
                  </div>

                  {applicationMessage && (
                    <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                      {applicationMessage}
                    </p>
                  )}

                  {applicationError && (
                    <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {applicationError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !!applicationMessage}
                    className="w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Apply Now"}
                  </button>

                  <p className="text-center text-xs leading-5 text-muted-foreground">
                    Your application will be sent to the tutor for review.
                  </p>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
