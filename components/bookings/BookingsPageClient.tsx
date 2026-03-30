"use client";

import Link from "next/link";
import { useState } from "react";

import useAuth from "@/hooks/useAuth";

import BookingCard from "./BookingCard";
import BookingsBottomNav from "./BookingsBottomNav";
import { BOOKING_MOCK_DATA, BOOKING_TIMEFRAME_OPTIONS } from "./bookings.data";
import BookingsHeader from "./BookingsHeader";
import type { BookingRecord, BookingStatus, BookingTimeframe } from "./types";

function isWithinTimeframe(
  booking: BookingRecord,
  selectedTimeframe: BookingTimeframe,
) {
  if (selectedTimeframe === "All Time") {
    return true;
  }

  const bookingDate = new Date(booking.dateISO);

  if (selectedTimeframe === "Next 30 Days") {
    const start = new Date("2026-03-30T00:00:00.000Z");
    const end = new Date("2026-04-29T23:59:59.999Z");

    return bookingDate >= start && bookingDate <= end;
  }

  const start = new Date("2025-12-30T00:00:00.000Z");
  const end = new Date("2026-03-30T23:59:59.999Z");

  return bookingDate >= start && bookingDate <= end;
}

function matchesSearch(booking: BookingRecord, searchTerm: string) {
  if (!searchTerm.trim()) {
    return true;
  }

  const query = searchTerm.trim().toLowerCase();

  return [booking.title, booking.location, booking.id, booking.stayType].some(
    (value) => value.toLowerCase().includes(query),
  );
}

function getStatusCount(bookings: BookingRecord[], status: BookingStatus) {
  return bookings.filter((booking) => booking.status === status).length;
}

export default function BookingsPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] =
    useState<BookingTimeframe>("Next 30 Days");
  const { userData, logout, isCheckingAuth } = useAuth();

  const visibleBookings = BOOKING_MOCK_DATA.filter(
    (booking) =>
      isWithinTimeframe(booking, timeframe) && matchesSearch(booking, searchTerm),
  );

  const upcomingCount = getStatusCount(BOOKING_MOCK_DATA, "upcoming");
  const completedCount = getStatusCount(BOOKING_MOCK_DATA, "completed");
  const cancelledCount = getStatusCount(BOOKING_MOCK_DATA, "cancelled");

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
        Checking authentication...
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <BookingsHeader userName={userData.naam} onLogout={logout} />

      <main className="relative overflow-hidden px-6 pb-32 pt-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[420px] max-w-6xl rounded-full bg-[radial-gradient(circle_at_top,_rgba(209,67,10,0.16),_transparent_58%)]" />
        <div className="pointer-events-none absolute left-1/2 top-32 -z-10 h-64 w-64 -translate-x-[120%] rounded-full bg-[radial-gradient(circle,_rgba(0,98,143,0.14),_transparent_70%)]" />

        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-outline-variant/20 bg-surface-container-lowest/80 p-7 shadow-[0_24px_80px_rgba(27,28,28,0.06)] backdrop-blur-sm md:p-9">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-primary">
                  Reservation Dashboard
                </span>
                <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
                  Your Bookings
                </h1>
                <p className="mt-3 max-w-xl text-base leading-7 text-on-surface-variant">
                  Track upcoming stays, revisit completed trips, and keep
                  cancelled reservations within reach. The data here is mocked,
                  so you can plug your APIs into the same UI when you are ready.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] bg-primary px-5 py-4 text-on-primary">
                  <p className="text-xs font-bold uppercase tracking-[0.22em]">
                    Upcoming
                  </p>
                  <p className="mt-3 font-headline text-3xl font-extrabold">
                    {upcomingCount}
                  </p>
                </div>
                <div className="rounded-[24px] bg-surface-container p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Completed
                  </p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-on-surface">
                    {completedCount}
                  </p>
                </div>
                <div className="rounded-[24px] bg-tertiary/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-tertiary">
                    Cancelled
                  </p>
                  <p className="mt-3 font-headline text-3xl font-extrabold text-tertiary">
                    {cancelledCount}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10 flex flex-col gap-8 lg:flex-row">
            <aside className="w-full shrink-0 lg:w-80">
              <div className="sticky top-28 space-y-6">
                <section className="rounded-[28px] border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0_18px_50px_rgba(27,28,28,0.05)]">
                  <h2 className="font-headline text-xl font-extrabold text-on-surface">
                    Filters
                  </h2>

                  <div className="mt-5 space-y-5">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/70">
                        Search
                      </span>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
                          search
                        </span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          placeholder="Search bookings..."
                          className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-10 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/70">
                        Timeframe
                      </span>
                      <select
                        value={timeframe}
                        onChange={(event) =>
                          setTimeframe(event.target.value as BookingTimeframe)
                        }
                        className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                      >
                        {BOOKING_TIMEFRAME_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </section>

                <section className="overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#a93200_0%,#d1430a_56%,#ffb59e_100%)] p-6 text-on-primary shadow-[0_24px_60px_rgba(169,50,0,0.18)]">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/80">
                    Travel Snapshot
                  </p>
                  <h3 className="mt-4 font-headline text-2xl font-extrabold tracking-tight">
                    Keep every stay in one polished view.
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Upcoming, completed, and cancelled bookings are already
                    structured here so you can hook in API data without
                    redesigning the screen.
                  </p>
                  <Link
                    href="/rooms"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    Browse more rooms
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </Link>
                </section>
              </div>
            </aside>

            <section className="flex-1 space-y-6">
              {visibleBookings.length > 0 ? (
                visibleBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <div className="rounded-[28px] border border-dashed border-outline-variant/50 bg-surface-container-lowest p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      search_off
                    </span>
                  </div>
                  <h2 className="mt-5 font-headline text-2xl font-extrabold text-on-surface">
                    No bookings match these filters
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-on-surface-variant">
                    Try a different search term or switch the timeframe back to
                    <span className="font-semibold text-on-surface">
                      {" "}
                      All Time
                    </span>
                    .
                  </p>
                </div>
              )}

              <div className="flex animate-pulse flex-col gap-8 rounded-[28px] bg-surface-container-low p-8 md:flex-row">
                <div className="h-52 w-full rounded-[24px] bg-surface-container-highest md:w-72" />
                <div className="flex-1 space-y-5">
                  <div className="h-8 w-1/3 rounded-xl bg-surface-container-highest" />
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="h-16 rounded-2xl bg-surface-container-highest" />
                    <div className="h-16 rounded-2xl bg-surface-container-highest" />
                    <div className="h-16 rounded-2xl bg-surface-container-highest" />
                    <div className="h-16 rounded-2xl bg-surface-container-highest" />
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <div className="h-6 w-36 rounded-full bg-surface-container-highest" />
                    <div className="h-11 w-32 rounded-full bg-surface-container-highest" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <BookingsBottomNav />
    </div>
  );
}
