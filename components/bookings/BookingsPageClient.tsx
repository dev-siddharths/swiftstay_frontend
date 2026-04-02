"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import useAuth from "@/hooks/useAuth";
import Pagination from "../shared/Pagination";

import BookingCard from "./BookingCard";
import BookingsBottomNav from "./BookingsBottomNav";
import {
  BOOKING_STATUS_FILTER_OPTIONS,
  BOOKING_TIMEFRAME_OPTIONS,
} from "./bookings.data";
import BookingsHeader from "./BookingsHeader";
import type {
  BookingFilterStatus,
  BookingRecord,
  BookingStatus,
  BookingTimeframe,
} from "./types";

type GetBookingApiRecord = {
  Booking_Id: number;
  Room_Name: string;
  Room_Img: string;
  Room_Location: string;
  Final_Price: number;
  Booking_Date: string;
  StartTime: string;
  EndTime: string;
  status: BookingStatus;
};

type GetBookingApiResponse = {
  success?: boolean;
  data?: GetBookingApiRecord[];
  message?: string;
};

type DeleteBookingResponse = {
  success?: boolean;
  message?: string;
};

function parseBookingDate(dateValue: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    const [year, month, day] = dateValue.split("-").map(Number);

    return new Date(year, month - 1, day);
  }

  return new Date(dateValue);
}

function parseBookingDateTime(dateValue: string, timeValue?: string) {
  const parsedDate = parseBookingDate(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  if (!timeValue || !/^\d{1,2}:\d{2}(:\d{2})?$/.test(timeValue)) {
    return parsedDate;
  }

  const [hours, minutes, seconds = "0"] = timeValue.split(":");

  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
    Number(hours),
    Number(minutes),
    Number(seconds),
  );
}

function formatDateLabel(dateValue: string) {
  const date = parseBookingDate(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatTimeLabel(timeValue: string) {
  const [hoursText, minutesText = "00"] = timeValue.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(2026, 0, 1, hours, minutes));
}

function getTimeRangeLabel(startTime: string, endTime: string) {
  return `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}`;
}

function getBookingStatus(booking: GetBookingApiRecord): BookingStatus {
  const bookingStartTime = parseBookingDateTime(
    booking.Booking_Date,
    booking.StartTime,
  );
  const bookingEndTime = parseBookingDateTime(
    booking.Booking_Date,
    booking.EndTime,
  );
  const now = Date.now();

  if (
    bookingStartTime &&
    bookingEndTime &&
    bookingStartTime.getTime() <= now &&
    bookingEndTime.getTime() >= now
  ) {
    return "ongoing";
  }

  if (bookingEndTime && bookingEndTime.getTime() < now) {
    return "completed";
  }

  return "upcoming";
}

function mapBookingRecord(booking: GetBookingApiRecord): BookingRecord {
  const bookingDateTime =
    parseBookingDateTime(booking.Booking_Date, booking.StartTime) ??
    new Date(booking.Booking_Date);

  return {
    id: `BK-${String(booking.Booking_Id).padStart(4, "0")}`,
    bookingId: booking.Booking_Id,
    title: booking.Room_Name,
    location: booking.Room_Location,
    imageSrc: booking.Room_Img,
    status: booking.status.toLowerCase() as BookingStatus,
    totalPrice: booking.Final_Price,
    dateLabel: formatDateLabel(booking.Booking_Date),
    timeLabel: formatTimeLabel(booking.StartTime),
    guestLabel: getTimeRangeLabel(booking.StartTime, booking.EndTime),
    stayType: "Room booking",
    dateISO: Number.isNaN(bookingDateTime.getTime())
      ? booking.Booking_Date
      : bookingDateTime.toISOString(),
  };
}

function sortBookings(left: BookingRecord, right: BookingRecord) {
  const statusOrder: Record<BookingStatus, number> = {
    ongoing: 0,
    upcoming: 1,
    completed: 2,
    cancelled: 3,
  };

  if (left.status !== right.status) {
    return statusOrder[left.status] - statusOrder[right.status];
  }

  const leftTime = new Date(left.dateISO).getTime();
  const rightTime = new Date(right.dateISO).getTime();

  return left.status === "ongoing" || left.status === "upcoming"
    ? leftTime - rightTime
    : rightTime - leftTime;
}

function isWithinTimeframe(
  booking: BookingRecord,
  selectedTimeframe: BookingTimeframe,
) {
  if (selectedTimeframe === "All Time") {
    return true;
  }

  const bookingDate = new Date(booking.dateISO);

  if (selectedTimeframe === "Next 30 Days") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 30);
    end.setHours(23, 59, 59, 999);

    return bookingDate >= start && bookingDate <= end;
  }

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setMonth(start.getMonth() - 3);
  start.setHours(0, 0, 0, 0);

  return bookingDate >= start && bookingDate <= end;
}

function matchesSearch(booking: BookingRecord, searchTerm: string) {
  if (!searchTerm.trim()) {
    return true;
  }

  const query = searchTerm.trim().toLowerCase();

  return [booking.title, booking.location, booking.id].some((value) =>
    value.toLowerCase().includes(query),
  );
}

function matchesStatusFilter(
  booking: BookingRecord,
  statusFilter: BookingFilterStatus,
) {
  if (statusFilter === "all") {
    return true;
  }

  return booking.status === statusFilter;
}

function getStatusCount(bookings: BookingRecord[], status: BookingStatus) {
  return bookings.filter((booking) => booking.status === status).length;
}

const BOOKINGS_PER_PAGE = 4;

export default function BookingsPageClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState<BookingTimeframe>("Next 30 Days");
  const [statusFilter, setStatusFilter] = useState<BookingFilterStatus>("all");
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [requestedPage, setRequestedPage] = useState(1);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [bookingToCancel, setBookingToCancel] = useState<BookingRecord | null>(
    null,
  );
  const [isCancellingBooking, setIsCancellingBooking] = useState(false);
  const { userData, logout, isCheckingAuth } = useAuth();

  useEffect(() => {
    if (isCheckingAuth || !userData) {
      return;
    }

    let ignore = false;

    async function fetchBookings() {
      setIsLoadingBookings(true);
      setBookingsError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          logout();
          return;
        }

        const response = await axios.get<GetBookingApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/getBooking`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (ignore) {
          return;
        }

        if (response.data?.success === false) {
          setBookings([]);
          setBookingsError(response.data.message ?? "Failed to load bookings");
          return;
        }

        const nextBookings = (response.data?.data ?? [])
          .map(mapBookingRecord)
          .sort(sortBookings);

        setBookings(nextBookings);
      } catch (error) {
        if (ignore) {
          return;
        }

        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout();
          return;
        }

        setBookings([]);
        setBookingsError(
          axios.isAxiosError(error)
            ? (error.response?.data?.message ?? "Failed to load bookings")
            : "Failed to load bookings",
        );
      } finally {
        if (!ignore) {
          setIsLoadingBookings(false);
        }
      }
    }

    void fetchBookings();

    return () => {
      ignore = true;
    };
  }, [isCheckingAuth, logout, refreshCounter, userData]);

  const visibleBookings = bookings.filter(
    (booking) =>
      isWithinTimeframe(booking, timeframe) &&
      matchesStatusFilter(booking, statusFilter) &&
      matchesSearch(booking, searchTerm),
  );
  const totalBookingPages = Math.max(
    1,
    Math.ceil(visibleBookings.length / BOOKINGS_PER_PAGE),
  );
  const currentPage = Math.min(requestedPage, totalBookingPages);
  const paginatedBookings = visibleBookings.slice(
    (currentPage - 1) * BOOKINGS_PER_PAGE,
    currentPage * BOOKINGS_PER_PAGE,
  );

  const upcomingCount = getStatusCount(bookings, "upcoming");
  const ongoingCount = getStatusCount(bookings, "ongoing");
  const cancelledCount = getStatusCount(bookings, "cancelled");

  async function handleConfirmCancel() {
    if (!bookingToCancel) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      logout();
      return;
    }

    setIsCancellingBooking(true);

    try {
      const response = await axios.post<DeleteBookingResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/deleteBooking`,
        {
          booking_id: bookingToCancel.bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(
          response.data.message ?? "Your booking has been cancelled",
        );
        setBookingToCancel(null);
        setRefreshCounter((current) => current + 1);
        return;
      }

      toast.error(response.data?.message ?? "Failed to cancel booking");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
        return;
      }

      toast.error(
        axios.isAxiosError(error)
          ? (error.response?.data?.message ?? "Failed to cancel booking")
          : "Failed to cancel booking",
      );
    } finally {
      setIsCancellingBooking(false);
    }
  }

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

      <main className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-[320px] max-w-5xl rounded-full bg-[radial-gradient(circle_at_top,_rgba(209,67,10,0.14),_transparent_60%)]" />
        <div className="pointer-events-none absolute left-1/2 top-28 -z-10 h-52 w-52 -translate-x-[120%] rounded-full bg-[radial-gradient(circle,_rgba(0,98,143,0.1),_transparent_72%)]" />

        <div className="mx-auto max-w-6xl">
          <section className="rounded-[26px] border border-outline-variant/15 bg-surface-container-lowest/90 p-5 shadow-[0_16px_40px_rgba(27,28,28,0.05)] backdrop-blur-sm md:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-primary">
                  Reservation Dashboard
                </span>
                <h1 className="mt-3 font-headline text-[1.9rem] font-extrabold tracking-tight text-on-surface md:text-[2rem]">
                  Your Bookings
                </h1>
                <p className="mt-2 max-w-lg text-sm leading-6 text-on-surface-variant md:text-[15px]">
                  Track upcoming stays and revisit past reservations in one
                  place. This page now reads directly from your live booking
                  data.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[330px]">
                <div className="rounded-[20px] bg-primary px-4 py-3.5 text-on-primary">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
                    Upcoming
                  </p>
                  <p className="mt-1.5 font-headline text-[1.75rem] font-extrabold leading-none">
                    {upcomingCount}
                  </p>
                </div>
                <div className="rounded-[20px] bg-surface-container px-4 py-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                    Ongoing
                  </p>
                  <p className="mt-1.5 font-headline text-[1.75rem] font-extrabold leading-none text-on-surface">
                    {ongoingCount}
                  </p>
                </div>
                <div className="rounded-[20px] bg-tertiary/10 px-4 py-3.5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-tertiary">
                    Cancelled
                  </p>
                  <p className="mt-1.5 font-headline text-[1.75rem] font-extrabold leading-none text-tertiary">
                    {cancelledCount}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-6 grid gap-5 xl:grid-cols-[248px_minmax(0,1fr)]">
            <aside className="w-full">
              <div className="sticky top-24 space-y-4">
                <section className="rounded-[22px] border border-outline-variant/15 bg-surface-container-lowest p-4 shadow-[0_14px_36px_rgba(27,28,28,0.05)]">
                  <h2 className="font-headline text-base font-extrabold text-on-surface">
                    Filters
                  </h2>

                  <div className="mt-4 space-y-3.5">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/70">
                        Search
                      </span>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
                          search
                        </span>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setRequestedPage(1);
                          }}
                          placeholder="Search bookings..."
                          className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-10 py-2.5 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                        />
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/70">
                        Status
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {BOOKING_STATUS_FILTER_OPTIONS.map((option) => {
                          const isActive = statusFilter === option.value;

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => {
                                setStatusFilter(option.value);
                                setRequestedPage(1);
                              }}
                              className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors ${
                                isActive
                                  ? "border-primary bg-primary text-on-primary"
                                  : "border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/70">
                        Timeframe
                      </span>
                      <select
                        value={timeframe}
                        onChange={(event) => {
                          setTimeframe(event.target.value as BookingTimeframe);
                          setRequestedPage(1);
                        }}
                        className="w-full rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2.5 text-sm outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
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

                <section className="overflow-hidden rounded-[22px] bg-[linear-gradient(160deg,#a93200_0%,#d1430a_56%,#ffb59e_100%)] p-4.5 text-on-primary shadow-[0_18px_42px_rgba(169,50,0,0.16)]">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                    Travel Snapshot
                  </p>
                  <h3 className="mt-2.5 font-headline text-lg font-extrabold tracking-tight">
                    Keep every stay in one polished view.
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-5 text-white/80">
                    Browse your reservations, refine them with filters, and jump
                    back into room discovery whenever you are ready.
                  </p>
                  <Link
                    href="/rooms"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    Browse more rooms
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </Link>
                </section>
              </div>
            </aside>

            <section className="space-y-4">
              {bookingsError ? (
                <div className="rounded-[22px] border border-error/20 bg-error-container/40 p-6">
                  <h2 className="font-headline text-[1.5rem] font-extrabold text-on-surface">
                    We could not load your bookings
                  </h2>
                  <p className="mt-2.5 max-w-lg text-sm leading-6 text-on-surface-variant">
                    {bookingsError}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRefreshCounter((current) => current + 1)}
                    className="mt-5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-transform active:scale-95"
                  >
                    Retry
                  </button>
                </div>
              ) : isLoadingBookings ? (
                <div className="flex animate-pulse flex-col gap-5 rounded-[22px] bg-surface-container-low p-5 md:flex-row">
                  <div className="h-48 w-full rounded-[18px] bg-surface-container-highest md:w-56" />
                  <div className="flex-1 space-y-4">
                    <div className="h-6 w-1/3 rounded-xl bg-surface-container-highest" />
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="h-14 rounded-2xl bg-surface-container-highest" />
                      <div className="h-14 rounded-2xl bg-surface-container-highest" />
                      <div className="h-14 rounded-2xl bg-surface-container-highest" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-36 rounded-full bg-surface-container-highest" />
                      <div className="h-11 w-32 rounded-full bg-surface-container-highest" />
                    </div>
                  </div>
                </div>
              ) : visibleBookings.length > 0 ? (
                <>
                  {paginatedBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancelReservation={setBookingToCancel}
                      isCancelling={
                        isCancellingBooking &&
                        bookingToCancel?.bookingId === booking.bookingId
                      }
                    />
                  ))}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalBookingPages}
                    onPageChange={setRequestedPage}
                    itemLabel="bookings"
                    totalItems={visibleBookings.length}
                  />
                </>
              ) : bookings.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-outline-variant/50 bg-surface-container-lowest p-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      calendar_month
                    </span>
                  </div>
                  <h2 className="mt-4 font-headline text-[1.5rem] font-extrabold text-on-surface">
                    No bookings yet
                  </h2>
                  <p className="mx-auto mt-2.5 max-w-md text-sm leading-6 text-on-surface-variant">
                    Once you reserve a room, it will appear here with its date,
                    slot, and total price.
                  </p>
                  <Link
                    href="/rooms"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-transform active:scale-95"
                  >
                    Explore rooms
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              ) : (
                <div className="rounded-[22px] border border-dashed border-outline-variant/50 bg-surface-container-lowest p-7 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      search_off
                    </span>
                  </div>
                  <h2 className="mt-4 font-headline text-[1.5rem] font-extrabold text-on-surface">
                    No bookings match these filters
                  </h2>
                  <p className="mx-auto mt-2.5 max-w-md text-sm leading-6 text-on-surface-variant">
                    Try a different search term, change the status filter, or
                    switch the timeframe back to
                    <span className="font-semibold text-on-surface">
                      {" "}
                      All Time
                    </span>
                    .
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {bookingToCancel ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-red-700">
              Cancel Reservation
            </p>
            <h2 className="mt-3 font-headline text-[1.5rem] font-extrabold tracking-tight text-on-surface">
              Are you sure you want to cancel this booking?
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              This will cancel{" "}
              <span className="font-semibold text-on-surface">
                {bookingToCancel.title}
              </span>{" "}
              for {bookingToCancel.dateLabel}. This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setBookingToCancel(null)}
                disabled={isCancellingBooking}
                className="rounded-lg border border-outline-variant/25 px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmCancel()}
                disabled={isCancellingBooking}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancellingBooking ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <BookingsBottomNav />
    </div>
  );
}
