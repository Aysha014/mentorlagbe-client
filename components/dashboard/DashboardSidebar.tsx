
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  GraduationCap,
  LogOut,
} from "lucide-react";

const menus = {
  student: [
  { label: "Overview", href: "/dashboard/student", icon: LayoutDashboard },
  { label: "My Applications", href: "/dashboard/student/my-applications", icon: FileText },
  { label: "Browse Tuitions", href: "/tuitions", icon: BookOpen },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
],
 tutor: [
  { label: "Overview", href: "/dashboard/tutor", icon: LayoutDashboard },
  { label: "My Tuitions", href: "/dashboard/tutor/my-tuitions", icon: BookOpen },
  { label: "Post Tuition", href: "/dashboard/tutor/post-tuition", icon: FileText },
  { label: "Applicants", href: "/dashboard/tutor/applicants", icon: Users },
  { label: "Billing", href: "/dashboard/tutor/billing", icon: CreditCard },
],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { label: "Manage Tuitions", href: "/dashboard/admin/tuitions", icon: BookOpen },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = pathname.split("/")[2] as keyof typeof menus;
  const currentMenus = menus[role] || menus.student;

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 text-gray-700 shadow-sm lg:hidden"
        aria-label="Open dashboard menu"
      >
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <button
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close dashboard menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-20 lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-teal-800"
            onClick={() => setMobileOpen(false)}
          >
            <GraduationCap size={27} />
            MentorLagbe
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 lg:hidden"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-5 py-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {role || "Dashboard"} Menu
          </p>

          <nav className="space-y-2">
            {currentMenus.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== `/dashboard/${role}` &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-teal-50 text-teal-800"
                      : "text-gray-600 hover:bg-gray-50 hover:text-teal-800"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-gray-100 p-5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LogOut size={19} />
            Back to Website
          </Link>
        </div>
      </aside>
    </>
  );
}
