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
  userId: number;
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
  userId,
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
          buildApiUrl("/room/getSlot"),
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

  const handleBookNow = async () => {
    if (!selectedSlot?.slotId) {
      toast.error("Please select an available slot");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again to continue");
      return;
    }

    setIsBooking(true);

    try {
      const payload = {
        user_id: userId,
        roomId: room.id,
        slotId: selectedSlot.slotId,
        date: formatApiDate(selectedDate),
        final_price: booking.total,
      };

      const response = await axios.post<BookingResponse>(
        buildApiUrl("/booking/createBooking"),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data?.success) {
        toast.success(response.data.message ?? "Booking successful");
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

      <RoomDetailsBottomNav roomId={String(room.id)} />
    </>
  );
}
