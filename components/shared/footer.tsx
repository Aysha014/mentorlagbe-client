
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.6V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.2v3h2.8v8h3.5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.3-8.4L1.8 2h6.5l4.4 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M5.2 3a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9h3.8v12H3.3V9Zm6.1 0H13v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.9 0 4.6 2.5 4.6 5.7V21h-3.8v-5.9c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V21H9.4V9Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#DCE9E3] bg-[#243B53] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-9 sm:gap-10 sm:py-12 lg:grid-cols-4 lg:py-14">

        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DDF3ED] text-[#147D75]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">
              Mentor<span className="text-[#8DDBCB]">Lagbe</span>
            </span>
          </Link>

          <p className="mt-3 max-w-sm text-xs leading-6 text-slate-300 sm:text-sm">
            Connecting students with the right tutors. Learn better, grow
            together, and achieve more.
          </p>

          <div className="mt-4 flex gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                title={social.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-[#8DDBCB] hover:bg-[#147D75] hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold sm:text-base">Quick Links</h3>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-xs text-slate-300 transition hover:text-[#8DDBCB] sm:text-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-semibold sm:text-base">Contact Us</h3>
          <ul className="mt-3 space-y-3 text-xs text-slate-300 sm:text-sm">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#8DDBCB]" />
              <a href="mailto:support@mentorlagbe.com" className="break-all hover:text-white">
                support@mentorlagbe.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#8DDBCB]" />
              <a href="tel:+8801700000000" className="hover:text-white">
                +880 1700-000000
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#8DDBCB]" />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-sm font-semibold sm:text-base">Start Your Journey</h3>
          <p className="mt-3 max-w-sm text-xs leading-6 text-slate-300 sm:text-sm">
            Looking for a tutor or teaching opportunities? Join MentorLagbe
            today.
          </p>

          <Link
            href="/sign-up"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#8DDBCB] px-4 py-2.5 text-xs font-semibold text-[#243B53] transition hover:bg-white sm:text-sm"
          >
            Join MentorLagbe
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-4 text-center text-[11px] text-slate-400 sm:flex-row sm:text-left sm:text-xs">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p>Made for better learning and brighter futures.</p>
        </div>
      </div>
    </footer>
  );
}
