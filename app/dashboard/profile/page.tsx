
"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  UserCircle,
  Mail,
  ShieldCheck,
  ArrowLeft,
  LayoutDashboard,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();

  const user = session?.user;

  const dashboardHref =
    user?.role === "admin"
      ? "/dashboard/admin"
      : user?.role === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student";

  if (isPending) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-48 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-700">Please sign in to view your profile.</p>
        <Link href="/sign-in" className="mt-4 inline-block text-teal-700">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
            Account Settings
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Profile
          </h1>
        </div>

        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-[#E5F4EF] px-6 py-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm">
              <UserCircle size={48} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.name}
              </h2>
              <p className="mt-1 text-sm capitalize text-gray-600">
                {user.role || "User"} Account
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Personal Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <UserCircle size={17} />
                  Full Name
                </div>
                <p className="mt-2 font-semibold text-gray-900">
                  {user.name}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail size={17} />
                  Email Address
                </div>
                <p className="mt-2 break-all font-semibold text-gray-900">
                  {user.email}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck size={17} />
                  Account Role
                </div>
                <p className="mt-2 font-semibold capitalize text-gray-900">
                  {user.role || "User"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
