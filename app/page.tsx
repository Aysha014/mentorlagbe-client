
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  GraduationCap,
  Monitor,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  Search,
} from "lucide-react";

const subjects = [
  { name: "Mathematics", icon: Calculator },
  { name: "English", icon: BookOpen },
  { name: "Science", icon: FlaskConical },
  { name: "ICT", icon: Monitor },
];

const tuitions = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Mathematics Tutor for Class 9",
    level: "Class 9",
    mode: "Online",
    fee: "৳5,000",
    location: "Dhaka",
    days: "4 days/week",
  },
  {
    id: 2,
    subject: "English",
    title: "English Tutor for HSC Student",
    level: "HSC",
    mode: "Offline",
    fee: "৳6,000",
    location: "Uttara, Dhaka",
    days: "5 days/week",
  },
  {
    id: 3,
    subject: "Physics",
    title: "Physics Tutor for Class 10",
    level: "Class 10",
    mode: "Online",
    fee: "৳4,500",
    location: "Dhaka",
    days: "3 days/week",
  },
];

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description:
      "Sign up as a student or tutor and create your personal profile.",
    icon: Users,
  },
  {
    number: "02",
    title: "Find the Right Match",
    description:
      "Explore tuition opportunities or discover students who need your expertise.",
    icon: Search,
  },
  {
    number: "03",
    title: "Start Learning",
    description:
      "Connect with each other and begin a successful learning journey.",
    icon: GraduationCap,
  },
];

const benefits = [
  "Verified tuition opportunities",
  "Easy application process",
  "Flexible learning options",
  "Student and tutor dashboards",
];

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary/5">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-2 md:gap-10 lg:px-8 lg:py-28">
          <div className="min-w-0">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary sm:text-sm">
              Your learning journey starts here
            </span>

            <h1 className="mt-5 text-3xl leading-tight font-extrabold tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">
              Find the Right Tutor.
              <span className="text-primary"> Achieve More.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:mt-6 sm:text-lg sm:leading-8">
              MentorLagbe connects students with qualified tutors to make
              learning easier, smarter, and more accessible.
            </p>

            <div className="mt-7 flex flex-col gap-3 min-[420px]:flex-row sm:mt-9">
              <Link
                href="/tuitions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 sm:text-base"
              >
                Find a Tutor
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl border bg-background px-6 py-3.5 text-sm font-semibold transition hover:bg-muted sm:text-base"
              >
                Become a Tutor
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-3 gap-3 sm:mt-10 sm:gap-8">
              <div>
                <p className="text-xl font-bold sm:text-2xl">500+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Tutors
                </p>
              </div>
              <div>
                <p className="text-xl font-bold sm:text-2xl">1,000+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Students
                </p>
              </div>
              <div>
                <p className="text-xl font-bold sm:text-2xl">20+</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  Subjects
                </p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-xl md:mx-0">
            <div className="rounded-3xl bg-primary p-2.5 shadow-2xl sm:p-3">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000"
                alt="Students studying together"
                className="h-64 w-full rounded-2xl object-cover sm:h-95 lg:h-107.5"
              />
            </div>

            <div className="absolute -bottom-5 left-2 max-w-[calc(100%-1rem)] rounded-xl border bg-background p-3 shadow-xl sm:-bottom-6 sm:-left-5 sm:rounded-2xl sm:p-5">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-full bg-green-100 p-2.5 text-green-700 sm:p-3">
                  <Users className="size-5 sm:size-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold sm:text-base">
                    Better Connections
                  </p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    Learn from the right people
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">Explore Subjects</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
            Learn What You Love
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
            Find experienced tutors across popular subjects.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 md:grid-cols-4">
          {subjects.map((subject) => {
            const Icon = subject.icon;

            return (
              <Link
                href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                key={subject.name}
                className="flex min-w-0 flex-col items-center justify-center rounded-2xl border bg-card p-5 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg sm:p-8"
              >
                <Icon className="size-8 text-primary sm:size-10" />
                <h3 className="mt-3 text-sm font-semibold sm:mt-4 sm:text-base">
                  {subject.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Latest Tuitions */}
      <section className="bg-muted/40 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">
                Latest Opportunities
              </p>
              <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
                Explore Recent Tuitions
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Discover opportunities that match your expertise.
              </p>
            </div>

            <Link
              href="/tuitions"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View All
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <article
                key={tuition.id}
                className="flex min-w-0 flex-col rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {tuition.subject}
                  </span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {tuition.mode}
                  </span>
                </div>

                <h3 className="mt-5 wrap-break-words text-lg font-bold sm:text-xl">
                  {tuition.title}
                </h3>

                <div className="mt-5 flex-1 space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <GraduationCap className="mt-0.5 size-4 shrink-0" />
                    <span>{tuition.level}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>{tuition.location}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Clock className="mt-0.5 size-4 shrink-0" />
                    <span>{tuition.days}</span>
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Monthly fee
                    </p>
                    <p className="text-lg font-bold text-primary sm:text-xl">
                      {tuition.fee}
                    </p>
                  </div>

                  <Link
                    href={`/tuitions/${tuition.id}`}
                    className="rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-muted sm:px-4 sm:text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="text-center">
          <p className="text-sm font-semibold text-primary">Simple Process</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
            How MentorLagbe Works
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base">
            Getting started is simple. Follow three easy steps to connect with
            the right learning opportunities.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="rounded-2xl border bg-card p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary sm:p-4">
                    <Icon className="size-6 sm:size-7" />
                  </div>
                  <span className="text-3xl font-extrabold text-primary/20 sm:text-4xl">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold sm:mt-6 sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground sm:mt-3">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why MentorLagbe */}
      <section className="bg-muted/40 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 sm:gap-12 lg:grid-cols-2 lg:px-8">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">
              Why MentorLagbe?
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
              Making Education More Accessible
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
              Whether you are a student searching for guidance or a tutor
              looking for teaching opportunities, MentorLagbe makes the
              connection easier.
            </p>

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium sm:text-base">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student and Tutor cards */}
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5">
            <div className="flex min-w-0 flex-col rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6 lg:p-7">
              <Users className="size-8 shrink-0 sm:size-9" />
              <h3 className="mt-4 wrap-break-word text-2xl font-bold sm:mt-5 sm:text-3xl">
                Students
              </h3>
              <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                Find tutors who understand your learning needs.
              </p>
            </div>

            <div className="flex min-w-0 flex-col rounded-2xl border bg-card p-5 min-[420px]:mt-8 sm:p-6 lg:mt-10 lg:p-7">
              <GraduationCap className="size-8 shrink-0 text-primary sm:size-9" />
              <h3 className="mt-4 break-words text-2xl font-bold sm:mt-5 sm:text-3xl">
                Tutors
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Discover teaching opportunities and grow your career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-primary/5 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary">Simple Pricing</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base">
              Start free and upgrade when you need more.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
            <div className="rounded-2xl border bg-card p-5 sm:p-8">
              <div className="flex items-center gap-2">
                <BookOpen className="size-6 text-primary" />
                <h3 className="text-lg font-bold sm:text-xl">Student Pro</h3>
              </div>

              <p className="mt-5 text-3xl font-extrabold sm:text-4xl">
                $10
                <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                  {" "}
                  / billing period
                </span>
              </p>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                For students looking for more learning opportunities.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Access to tuition opportunities</li>
                <li>✓ Manage applications</li>
                <li>✓ Personalized dashboard</li>
              </ul>

              <Link
                href="/pricing"
                className="mt-7 block rounded-xl border py-3 text-center text-sm font-semibold transition hover:bg-muted"
              >
                Explore Plan
              </Link>
            </div>

            <div className="rounded-2xl border-2 border-primary bg-card p-5 shadow-lg sm:p-8">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-6 text-primary" />
                <h3 className="text-lg font-bold sm:text-xl">Tutor Pro</h3>
              </div>

              <p className="mt-5 text-3xl font-extrabold sm:text-4xl">
                $15
                <span className="text-xs font-normal text-muted-foreground sm:text-sm">
                  {" "}
                  / billing period
                </span>
              </p>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                For tutors who want to grow their teaching opportunities.
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                <li>✓ Unlimited tuition posts</li>
                <li>✓ Manage student applications</li>
                <li>✓ Personalized tutor dashboard</li>
              </ul>

              <Link
                href="/pricing"
                className="mt-7 block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Explore Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="rounded-2xl bg-primary px-5 py-12 text-center text-primary-foreground sm:rounded-3xl sm:px-10 sm:py-14 md:px-16">
          <GraduationCap className="mx-auto size-10 sm:size-12" />

          <h2 className="mt-5 text-2xl font-bold sm:text-4xl">
            Ready to Start Your Journey?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
            Join MentorLagbe today and connect with the right learning
            opportunities.
          </p>

          <Link
            href="/sign-up"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-background px-6 py-3 text-sm font-semibold text-foreground transition hover:opacity-90 sm:mt-8 sm:text-base"
          >
            Join MentorLagbe
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
