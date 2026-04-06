"use client";

import Link from "next/link";

type BookingsHeaderProps = {
  userName?: string;
  onLogout: () => void;
};

function getInitials(userName?: string) {
  if (!userName) {
    return "SS";
  }

  const parts = userName.trim().split(/\s+/);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function BookingsHeader({
  userName,
  onLogout,
}: BookingsHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Link
            href="/rooms"
            className="text-primary font-headline font-extrabold tracking-tighter text-2xl"
          >
            SwiftStay
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/rooms"
            className="text-on-surface font-semibold text-sm hover:opacity-80 transition-opacity"
          >
            Home
          </Link>
          <Link
            href="/bookings"
            className="text-primary font-semibold text-sm"
          >
            Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border-2 border-primary/10 flex items-center justify-center"
            title={userName ?? "SwiftStay user"}
          >
            <span className="text-primary font-bold text-sm">
              {getInitials(userName)}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="bg-red-300 p-3 rounded-3xl cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
