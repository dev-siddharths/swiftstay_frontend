"use client";

import Link from "next/link";

const NAV_ITEMS = [
  { href: "/rooms", icon: "home", label: "Home" },
  { href: "/bookings", icon: "event_note", label: "Bookings", active: true },
];

export default function BookingsBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t border-outline-variant/20 bg-surface/85 px-4 pb-6 pt-3 shadow-[0_-8px_32px_rgba(27,28,28,0.08)] backdrop-blur-xl md:hidden">
      {NAV_ITEMS.map((item) => {
        const className = item.active
          ? "flex flex-col items-center justify-center rounded-2xl bg-primary/10 px-5 py-2 text-primary"
          : "flex flex-col items-center justify-center px-5 py-2 text-on-surface/55 transition-colors hover:text-primary";

        const content = (
          <>
            <span className="material-symbols-outlined mb-1">{item.icon}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              {item.label}
            </span>
          </>
        );

        return (
          <Link key={item.label} href={item.href} className={className}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
