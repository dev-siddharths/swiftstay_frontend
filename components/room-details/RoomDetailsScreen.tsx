"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import RoomAmenities from "./RoomAmenities";
import RoomBookingSection from "./RoomBookingSection";
import RoomBookingSidebar from "./RoomBookingSidebar";
import RoomDetailsBottomNav from "./RoomDetailsBottomNav";
import type { RoomDetailsInput } from "./roomDetails.types";
import {
  buildMiniCalendar,
  buildTimeSlotsFromApi,
  buildRoomDetailsViewModel,
  formatApiDate,
  formatBookingDate,
  formatCurrency,
  formatMonthLabel,
  getInitialSelectedDate,
  getBookingBreakdown,
  isPastMonth,
} from "./roomDetails.data";
import RoomDetailsGallery from "./RoomDetailsGallery";
import RoomDetailsOverview from "./RoomDetailsOverview";
import { buildApiUrl } from "@/lib/api";

type RoomDetailsScreenProps = {
  room: RoomDetailsInput;
};

type SlotsResponse = {
  success?: boolean;
  data?: Array<{
    id: number;
    startTime: string;
    endTime: string;
  }>;
  message?: string;
};

type BookingResponse = {
  success?: boolean;
  message?: string;
};

export default function RoomDetailsScreen({
  room,
}: RoomDetailsScreenProps) {
  const details = buildRoomDetailsViewModel(room);
  const [today] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    getInitialSelectedDate(
      new Date(today.getFullYear(), today.getMonth(), 1),
      today,
    ),
  );
  const [timeSlots, setTimeSlots] = useState(details.timeSlots);
  const [selectedSlotId, setSelectedSlotId] = useState(details.defaultSlotId);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);

  const fetchSlots = useCallback(
    async (shouldIgnore?: () => boolean) => {
      if (shouldIgnore?.()) {
        return;
      }

      setIsLoadingSlots(true);
      setSlotsError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Missing auth token");
        }

        const response = await axios.post<SlotsResponse>(
          buildApiUrl("/rooms/slots"),
          {
            id: room.id,
            date: formatApiDate(selectedDate),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (shouldIgnore?.()) {
          return;
        }

        const nextSlots = buildTimeSlotsFromApi(
          response.data?.data,
          details.basePrice,
        );
        const firstAvailableSlot = nextSlots.find((slot) => !slot.disabled);

        setTimeSlots(nextSlots);
        setSelectedSlotId((currentSelectedSlotId) =>
          nextSlots.some(
            (slot) => slot.id === currentSelectedSlotId && !slot.disabled,
          )
            ? currentSelectedSlotId
            : firstAvailableSlot?.id ?? "",
        );

        if (response.data?.success === false) {
          setSlotsError(response.data.message ?? "Failed to load slots");
        }
      } catch {
        if (shouldIgnore?.()) {
          return;
        }

        setTimeSlots(buildTimeSlotsFromApi([], details.basePrice));
        setSelectedSlotId("");
        setSlotsError("Failed to load slots");
      } finally {
        if (!shouldIgnore?.()) {
          setIsLoadingSlots(false);
        }
      }
    },
    [details.basePrice, room.id, selectedDate],
  );

  useEffect(() => {
    let ignore = false;

    void fetchSlots(() => ignore);

    return () => {
      ignore = true;
    };
  }, [fetchSlots]);

  const calendarDays = buildMiniCalendar(calendarMonth, today);
  const selectedSlot =
    timeSlots.find((slot) => slot.id === selectedSlotId && !slot.disabled) ??
    null;
  const booking = getBookingBreakdown(selectedSlot?.price ?? details.basePrice);
  const isBookDisabled =
    isLoadingSlots || isBooking || !selectedSlot || !selectedSlot.slotId;

  const handleBookNow = () => {
    if (!selectedSlot?.slotId) {
      toast.error("Please select an available slot");
      return;
    }
    setShowBookingConfirm(true);
  };

  const confirmBooking = async () => {
    if (!selectedSlot?.slotId) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again to continue");
      setShowBookingConfirm(false);
      return;
    }

    setIsBooking(true);

    try {
      const payload = {
        roomId: room.id,
        slotId: selectedSlot.slotId,
        date: formatApiDate(selectedDate),
        final_price: booking.total,
      };

      const response = await axios.post<BookingResponse>(
        buildApiUrl("/bookings"),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(response.data.message ?? "Booking successful");
        setShowBookingConfirm(false);
        return;
      }

      toast.error(response.data?.message ?? "Booking failed");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Booking failed");
      } else {
        toast.error("Booking failed");
      }
    } finally {
      await fetchSlots();
      setIsBooking(false);
      setShowBookingConfirm(false);
    }
  };

  const shiftMonth = (direction: number) => {
    const nextMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + direction,
      1,
    );

    if (isPastMonth(nextMonth, today)) {
      return;
    }

    setCalendarMonth(nextMonth);
    setSelectedDate(getInitialSelectedDate(nextMonth, today));
  };

  return (
    <>
      <main className="pt-24 pb-20 max-w-screen-2xl mx-auto px-8">
        <div className="max-w-5xl mx-auto">
          <RoomDetailsGallery images={details.images} />
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-[68%]">
            <RoomDetailsOverview
              title={details.title}
              location={details.location}
              introHeading={details.introHeading}
              introParagraphs={details.introParagraphs}
            />

            <RoomAmenities amenities={details.amenities} />

            <RoomBookingSection
              monthLabel={formatMonthLabel(calendarMonth)}
              weekdays={details.calendarWeekdays}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onPreviousMonth={() => shiftMonth(-1)}
              onNextMonth={() => shiftMonth(1)}
              canGoToPreviousMonth={
                !isPastMonth(
                  new Date(
                    calendarMonth.getFullYear(),
                    calendarMonth.getMonth() - 1,
                    1,
                  ),
                  today,
                )
              }
              timeSlots={timeSlots}
              selectedSlotId={selectedSlotId}
              onSlotSelect={setSelectedSlotId}
              isLoadingSlots={isLoadingSlots}
              slotsError={slotsError}
            />
          </div>

          <aside className="lg:w-[32%] relative">
            <RoomBookingSidebar
              basePrice={selectedSlot?.price ?? details.basePrice}
              selectedDateLabel={formatBookingDate(selectedDate)}
              selectedSlotLabel={selectedSlot?.time ?? "No slots available"}
              serviceFee={booking.serviceFee}
              occupancyTaxes={booking.occupancyTaxes}
              total={booking.total}
              onBookNow={handleBookNow}
              isBooking={isBooking}
              isBookDisabled={isBookDisabled}
            />
          </aside>
        </div>
      </main>

      {showBookingConfirm ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-[24px] border border-outline-variant/15 bg-surface-container-lowest p-6 shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Confirm Reservation
            </p>
            <h2 className="mt-3 font-headline text-[1.5rem] font-extrabold tracking-tight text-on-surface">
              Ready to book this room?
            </h2>
            <p className="mt-3 text-sm leading-6 text-on-surface-variant">
              Please review your booking details before confirming.
            </p>

            <div className="mt-5 space-y-3 rounded-xl bg-surface-container-low border border-outline-variant/10 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Room</span>
                <span className="font-semibold text-on-surface">
                  {details.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Date</span>
                <span className="font-semibold text-on-surface">
                  {formatBookingDate(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Time Slot</span>
                <span className="font-semibold text-on-surface">
                  {selectedSlot?.time ?? "—"}
                </span>
              </div>
              <div className="h-px bg-outline-variant/15 w-full" />
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">
                  1 Slot x {formatCurrency(selectedSlot?.price ?? details.basePrice)}
                </span>
                <span className="font-medium text-on-surface">
                  {formatCurrency(selectedSlot?.price ?? details.basePrice)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Service Fee</span>
                <span className="font-medium text-on-surface">
                  {formatCurrency(booking.serviceFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-on-surface-variant">Occupancy Taxes</span>
                <span className="font-medium text-on-surface">
                  {formatCurrency(booking.occupancyTaxes)}
                </span>
              </div>
              <div className="h-px bg-outline-variant/15 w-full" />
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-on-surface">Total</span>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(booking.total)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowBookingConfirm(false)}
                disabled={isBooking}
                className="rounded-lg border border-outline-variant/25 px-4 py-2.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-60"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => void confirmBooking()}
                disabled={isBooking}
                className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBooking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <RoomDetailsBottomNav />
    </>
  );
}
