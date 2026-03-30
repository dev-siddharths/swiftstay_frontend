export type BookingStatus = "upcoming" | "completed" | "cancelled";

export type BookingRecord = {
  id: string;
  title: string;
  location: string;
  imageSrc?: string;
  status: BookingStatus;
  totalPrice: number;
  dateLabel: string;
  timeLabel: string;
  guestLabel: string;
  stayType: string;
  dateISO: string;
  actionLabel: string;
  secondaryActionLabel?: string;
};

export type BookingTimeframe = "Next 30 Days" | "Past 3 Months" | "All Time";
