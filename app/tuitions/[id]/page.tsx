
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Monitor,
  Wallet,
} from "lucide-react";

const tuitionData = [
  {
    id: "1",
    title: "Experienced Mathematics Tutor for Class 9–10",
    subject: "Mathematics",
    classLevel: "Class 9–10",
    mode: "Offline",
    location: "Dhanmondi, Dhaka",
    monthlyFee: 6000,
    daysPerWeek: 4,
    tutorName: "Ahmed Rahman",
    tutorEmail: "ahmed@example.com",
    description:
      "Looking for a dedicated mathematics tutor for Class 9–10 students. The tutor should have strong subject knowledge and be able to explain complex mathematical concepts in a simple and understandable way. Previous teaching experience is preferred.",
  },
  {
    id: "2",
    title: "Physics Tutor Needed for HSC Student",
    subject: "Physics",
    classLevel: "HSC",
    mode: "Online",
    location: "Online",
    monthlyFee: 5000,
    daysPerWeek: 3,
    tutorName: "Sadia Islam",
    tutorEmail: "sadia@example.com",
    description:
      "An experienced physics tutor is needed for an HSC student. The tutor should provide clear explanations, solve numerical problems and help the student prepare for examinations.",
  },
  {
    id: "3",
    title: "English Tutor for Class 6 Student",
    subject: "English",
    classLevel: "Class 6",
    mode: "Offline",
    location: "Uttara, Dhaka",
    monthlyFee: 4000,
    daysPerWeek: 3,
    tutorName: "Nusrat Jahan",
    tutorEmail: "nusrat@example.com",
    description:
      "Looking for an English tutor to improve grammar, vocabulary, reading and writing skills. The tutor should be friendly and experienced in teaching school students.",
  },
  {
    id: "4",
    title: "Chemistry Tutor for HSC Preparation",
    subject: "Chemistry",
    classLevel: "HSC",
    mode: "Online",
    location: "Online",
    monthlyFee: 5500,
    daysPerWeek: 4,
    tutorName: "Tanvir Hasan",
    tutorEmail: "tanvir@example.com",
    description:
      "Need a chemistry tutor for HSC preparation. The tutor should cover the syllabus systematically and provide regular practice and exam preparation support.",
  },
  {
    id: "5",
    title: "Science Tutor for Class 8",
    subject: "Science",
    classLevel: "Class 8",
    mode: "Offline",
    location: "Mirpur, Dhaka",
    monthlyFee: 4500,
    daysPerWeek: 4,
    tutorName: "Farhana Akter",
    tutorEmail: "farhana@example.com",
    description:
      "A science tutor is needed for a Class 8 student. The tutor should explain basic science concepts, assist with homework and prepare the student for school examinations.",
  },
  {
    id: "6",
    title: "ICT Tutor for HSC Student",
    subject: "ICT",
    classLevel: "HSC",
    mode: "Online",
    location: "Online",
    monthlyFee: 3500,
    daysPerWeek: 2,
    tutorName: "Rakib Hasan",
    tutorEmail: "rakib@example.com",
    description:
      "An ICT tutor is required to help an HSC student understand programming fundamentals, database concepts and other important ICT topics.",
  },
];

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TuitionDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const tuition = tuitionData.find((item) => item.id === id);

  if (!tuition) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6">
        <BookOpen className="mx-auto mb-5 size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold sm:text-3xl">
          Tuition Not Found
        </h1>
        <p className="mt-3 text-muted-foreground">
          This tuition may have been removed or is no longer available.
        </p>
        <Link
          href="/tuitions"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft className="size-4" />
          Browse Tuitions
        </Link>
      </main>
    );
  }

  const details = [
    {
      icon: BookOpen,
      label: "Subject",
      value: tuition.subject,
    },
    {
      icon: GraduationCap,
      label: "Class Level",
      value: tuition.classLevel,
    },
    {
      icon: tuition.mode === "Online" ? Monitor : MapPin,
      label: "Teaching Mode",
      value: tuition.mode,
    },
    {
      icon: MapPin,
      label: "Location",
      value: tuition.location,
    },
    {
      icon: CalendarDays,
      label: "Days Per Week",
      value: `${tuition.daysPerWeek} days`,
    },
    {
      icon: Clock,
      label: "Schedule",
      value: "To be discussed",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <Link
          href="/tuitions"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Browse Tuitions
        </Link>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-7">
            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {tuition.subject}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {tuition.mode}
                </span>
              </div>

              <h1 className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {tuition.title}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <GraduationCap className="size-4 shrink-0 text-primary" />
                  {tuition.classLevel}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  {tuition.location}
                </span>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold sm:text-2xl">
                Tuition Overview
              </h2>

              <p className="mt-4 leading-7 text-muted-foreground">
                {tuition.description}
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
              <h2 className="text-xl font-bold sm:text-2xl">
                About the Tutor
              </h2>

              <div className="mt-5 flex min-w-0 items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <GraduationCap className="size-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold">{tuition.tutorName}</h3>
                  <p className="break-all text-sm text-muted-foreground">
                    {tuition.tutorEmail}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Tuition poster
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
              <p className="text-sm font-medium text-muted-foreground">
                Monthly Tuition Fee
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-1">
                <span className="text-3xl font-bold text-primary sm:text-4xl">
                  ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                </span>
                <span className="text-sm text-muted-foreground">
                  / month
                </span>
              </div>

              <div className="my-6 border-t border-border" />

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Subject</span>
                  <span className="text-right font-semibold">
                    {tuition.subject}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Class</span>
                  <span className="text-right font-semibold">
                    {tuition.classLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="text-right font-semibold">
                    {tuition.mode}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Days/week</span>
                  <span className="text-right font-semibold">
                    {tuition.daysPerWeek}
                  </span>
                </div>
              </div>

              <Link
                href="/sign-in"
                className="mt-7 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Sign In to Apply
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                Sign in with your student account to apply for this tuition.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
