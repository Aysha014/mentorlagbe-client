
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
  UserCircle,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

type ProfileMenuProps = {
  user: {
    name: string;
    email: string;
  };
  role?: string;
  dashboardHref: string;
  onSignOut: () => void;
  isSigningOut: boolean;
};

function ProfileMenu({
  user,
  role,
  dashboardHref,
  onSignOut,
  isSigningOut,
}: ProfileMenuProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsProfileOpen((previous) => !previous)}
        aria-expanded={isProfileOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-[#DDF3ED]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDF3ED] text-sm font-bold text-[#147D75]">
          {user.name?.charAt(0).toUpperCase() || "U"}
        </span>

        <span className="hidden max-w-28 truncate text-sm font-semibold text-[#243B53] lg:block">
          {user.name}
        </span>

        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>

      {isProfileOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-64 rounded-2xl border border-[#E5EAE5] bg-white p-3 shadow-xl">
          <div className="border-b border-slate-100 px-3 py-3">
            <p className="truncate text-sm font-semibold text-[#243B53]">
              {user.name}
            </p>

            <p className="mt-1 truncate text-xs text-slate-500">
              {user.email}
            </p>

            <span className="mt-2 inline-block rounded-full bg-[#DDF3ED] px-2.5 py-1 text-xs font-medium capitalize text-[#147D75]">
              {role || "User"}
            </span>
          </div>

          <Link
            href={dashboardHref}
            onClick={() => setIsProfileOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#DDF3ED] hover:text-[#147D75]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/profile"
            onClick={() => setIsProfileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-[#DDF3ED] hover:text-[#147D75]"
          >
            <UserCircle className="h-4 w-4" />
            My Profile
          </Link>

          <button
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const role = user?.role;

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student";

  function closeMenu() {
    setIsOpen(false);
  }

  async function handleSignOut() {
    try {
      setIsSigningOut(true);

      const result = await signOut();

      if (result.error) {
        console.error("Sign out error:", result.error);
        return;
      }

      closeMenu();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5EAE5] bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#147D75]">
            <GraduationCap className="h-6 w-6" />
          </span>

          <span className="text-xl font-bold tracking-tight text-[#243B53] sm:text-2xl">
            Mentor<span className="text-[#147D75]">Lagbe</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#147D75]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <ProfileMenu
              user={{
                name: user.name,
                email: user.email,
              }}
              role={role}
              dashboardHref={dashboardHref}
              onSignOut={handleSignOut}
              isSigningOut={isSigningOut}
            />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[#243B53] transition hover:bg-[#DDF3ED]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="flex items-center gap-2 rounded-xl bg-[#147D75] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#10665F]"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-[#243B53] transition hover:bg-[#DDF3ED] md:hidden"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile navigation */}
      {isOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-[#E5EAE5] bg-white px-5 py-5 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#DDF3ED] hover:text-[#147D75]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-slate-100 pt-4">
            {isPending ? (
              <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 rounded-xl bg-[#F2F8F5] p-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DDF3ED] font-bold text-[#147D75]">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#243B53]">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-slate-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href={dashboardHref}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#DDF3ED]"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#DDF3ED]"
                >
                  <UserCircle className="h-4 w-4" />
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="rounded-xl border border-[#147D75] px-4 py-3 text-center text-sm font-semibold text-[#147D75] transition hover:bg-[#DDF3ED]"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="rounded-xl bg-[#147D75] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#10665F]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
