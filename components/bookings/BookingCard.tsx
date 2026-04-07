import Image from "next/image";

import type { BookingRecord } from "./types";

type BookingCardProps = {
  booking: BookingRecord;
  onCancelReservation?: (booking: BookingRecord) => void;
  isCancelling?: boolean;
};

const STATUS_STYLES = {
  upcoming: {
    badge: "bg-primary text-on-primary",
    card: "bg-surface-container-lowest shadow-[0_18px_40px_rgba(169,50,0,0.08)]",
    title: "text-on-surface",
    meta: "text-on-surface-variant",
    border: "border-outline-variant/20",
    statusText: "text-primary",
    icon: "schedule",
  },
  ongoing: {
    badge: "bg-tertiary text-on-tertiary",
    card: "bg-surface-container-lowest shadow-[0_18px_40px_rgba(0,98,143,0.12)]",
    title: "text-on-surface",
    meta: "text-on-surface-variant",
    border: "border-tertiary/15",
    statusText: "text-tertiary",
    icon: "hourglass_top",
  },
  completed: {
    badge: "bg-secondary text-on-secondary",
    card: "bg-surface-container-low/60",
    title: "text-on-surface/80",
    meta: "text-on-surface-variant/80",
    border: "border-outline-variant/15",
    statusText: "text-secondary",
    icon: "check_circle",
  },
  cancelled: {
    badge: "bg-error-container text-red-700",
    card: "bg-surface-container-low/40",
    title: "text-on-surface/65",
    meta: "text-on-surface-variant/70",
    border: "border-dashed border-outline-variant/40",
    statusText: "text-red-700",
    icon: "cancel",
  },
} as const;

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function BookingCard({
  booking,
  onCancelReservation,
  isCancelling = false,
}: BookingCardProps) {
  const styles = STATUS_STYLES[booking.status];

  return (
    <article
      className={`group overflow-hidden rounded-[22px] border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(27,28,28,0.08)] ${styles.card} ${styles.border}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative h-48 w-full overflow-hidden md:h-auto md:w-[240px] lg:w-[260px]">
          {booking.imageSrc ? (
            <>
              <Image
                src={booking.imageSrc}
                alt={booking.title}
                fill
                sizes="(min-width: 1280px) 260px, (min-width: 768px) 240px, 100vw"
                className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
                  booking.status === "completed" ? "grayscale-[35%]" : ""
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-dim">
              <span className="material-symbols-outlined text-7xl text-on-surface-variant/20">
                event_busy
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4">
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] shadow-sm ${styles.badge}`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 md:p-5 lg:p-5.5">
          <div>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-surface-container px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  {booking.id}
                </div>
                <h2 className={`font-headline text-[1.5rem] font-extrabold leading-tight ${styles.title}`}>
                  {booking.title}
                </h2>
                <p className={`mt-1.5 flex items-center gap-1.5 text-[13px] font-medium ${styles.meta}`}>
                  <span className="material-symbols-outlined text-base">
                    location_on
                  </span>
                  {booking.location}
                </p>
              </div>

              <div className="shrink-0 md:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
                  Total Price
                </p>
                <p className="mt-1.5 font-headline text-[1.7rem] font-extrabold tracking-tight text-primary">
                  {formatPrice(booking.totalPrice)}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 rounded-[18px] border border-outline-variant/15 bg-surface/60 p-3.5 md:grid-cols-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
                  Stay Dates
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-on-surface">
                  {booking.dateLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
                  Check In Time
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-on-surface">
                  {booking.timeLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
                  Slot
                </p>
                <p className="mt-1.5 text-[14px] font-semibold text-on-surface">
                  {booking.guestLabel}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] ${styles.statusText}`}>
              <span className="material-symbols-outlined text-lg">{styles.icon}</span>
              Status: {booking.status}
            </div>

            <div className="flex flex-wrap gap-3">
              {booking.status === "upcoming" ? (
                <button
                  type="button"
                  onClick={() => onCancelReservation?.(booking)}
                  disabled={isCancelling}
                  className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCancelling ? "Cancelling..." : "Cancel Reservation"}
                </button>
              ) : null}
              {booking.secondaryActionLabel ? (
                <button
                  type="button"
                  className="rounded-full border border-outline-variant/40 px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-low"
                >
                  {booking.secondaryActionLabel}
                </button>
              ) : null}
              {booking.actionLabel ? (
                <button
                  type="button"
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-transform active:scale-95 ${
                    booking.status === "cancelled"
                      ? "bg-surface-container-high text-on-surface"
                      : "bg-primary text-on-primary"
                  }`}
                >
                  {booking.actionLabel}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
