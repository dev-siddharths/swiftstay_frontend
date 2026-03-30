"use client";

import axios from "axios";
import { useEffect, useState } from "react";
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

type RoomDetailsScreenProps = {
  room: RoomDetailsInput;
};

type SlotsResponse = {
  success?: boolean;
  data?: Array<{
    startTime: string;
    endTime: string;
  }>;
  message?: string;
};

export default function RoomDetailsScreen({ room }: RoomDetailsScreenProps) {
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

  useEffect(() => {
    let ignore = false;

    async function fetchSlots() {
      setIsLoadingSlots(true);
      setSlotsError(null);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Missing auth token");
        }

        const response = await axios.post<SlotsResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/room/getSlot`,
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

        if (ignore) {
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
        if (ignore) {
          return;
        }

        setTimeSlots(buildTimeSlotsFromApi([], details.basePrice));
        setSelectedSlotId("");
        setSlotsError("Failed to load slots");
      } finally {
        if (!ignore) {
          setIsLoadingSlots(false);
        }
      }
    }

    fetchSlots();

    return () => {
      ignore = true;
    };
  }, [details.basePrice, room.id, selectedDate]);

  const calendarDays = buildMiniCalendar(calendarMonth, today);
  const selectedSlot =
    timeSlots.find((slot) => slot.id === selectedSlotId && !slot.disabled) ??
    null;
  const booking = getBookingBreakdown(selectedSlot?.price ?? details.basePrice);

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
              rating={details.rating}
              reviewCount={details.reviewCount}
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
            />
          </aside>
        </div>
      </main>

      <RoomDetailsBottomNav roomId={String(room.id)} />
    </>
  );
}
