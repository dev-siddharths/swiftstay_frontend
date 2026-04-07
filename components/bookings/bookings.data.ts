import type {
  BookingFilterStatus,
  BookingTimeframe,
} from "./types";

export const BOOKING_TIMEFRAME_OPTIONS: BookingTimeframe[] = [
  "Next 30 Days",
  "Past 3 Months",
  "All Time",
];

export const BOOKING_STATUS_FILTER_OPTIONS: Array<{
  value: BookingFilterStatus;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
