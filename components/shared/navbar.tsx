
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
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

        {/* Desktop buttons */}
        <div className="hidden items-center gap-3 md:flex">
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

      {/* Mobile dropdown */}
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

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
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
        </div>
      )}
    </header>
  );
}
