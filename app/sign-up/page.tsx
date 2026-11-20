
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";

type UserRole = "student" | "tutor";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.trim().length < 2) {
      toast.error("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return;
      }

      toast.success("Account created successfully!");

      router.push(
        role === "student"
          ? "/dashboard/student"
          : "/dashboard/tutor"
      );
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-muted/30 px-4 py-12 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">

        {/* Left Section */}
        <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="size-9" />
              <span className="text-2xl font-bold">MentorLagbe</span>
            </Link>

            <div className="mt-24">
              <h1 className="text-4xl leading-tight font-bold">
                Start your learning journey with us.
              </h1>

              <p className="mt-5 leading-7 text-primary-foreground/80">
                Connect with qualified tutors, discover learning
                opportunities and achieve your educational goals.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 p-6">
            <BookOpen className="mb-3 size-8" />
            <p className="font-semibold">
              Better connections. Better learning.
            </p>
            <p className="mt-2 text-sm text-primary-foreground/75">
              Your next learning opportunity starts here.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 lg:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary"
            >
              <GraduationCap className="size-8" />
              <span className="text-xl font-bold">MentorLagbe</span>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join MentorLagbe and get started today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="name"
                required
                minLength={2}
                disabled={isLoading}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-3 block text-sm font-semibold">
                I want to join as
              </label>

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setRole("student")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "student"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <BookOpen className="mb-3 size-6 text-primary" />
                  <p className="font-semibold">Student</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Find tutors and apply for tuition.
                  </p>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setRole("tutor")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "tutor"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <GraduationCap className="mb-3 size-6 text-primary" />
                  <p className="font-semibold">Tutor</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Post tuition opportunities and find students.
                  </p>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </Link>
          </p>

          <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">
            By creating an account, you agree to our Terms of Service
            and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
