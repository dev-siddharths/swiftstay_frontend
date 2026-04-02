import type {
  CalendarDay,
  RoomAmenity,
  RoomDetailsInput,
  RoomTimeSlot,
  RoomDetailsViewModel,
  RoomImage,
} from "./roomDetails.types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const bookingDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const SLOT_DEFINITIONS = [
  {
    id: "morning",
    startTime: "09:00:00",
    endTime: "12:00:00",
    label: "Morning Bliss",
  },
  {
    id: "midday",
    startTime: "12:00:00",
    endTime: "15:00:00",
    label: "Midday Sun",
  },
  {
    id: "golden-hour",
    startTime: "15:00:00",
    endTime: "18:00:00",
    label: "Golden Hour",
  },
  {
    id: "twilight",
    startTime: "18:00:00",
    endTime: "21:00:00",
    label: "Twilight Glow",
  },
] as const;

const DEFAULT_IMAGES: RoomImage[] = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBATZGxGUINC7I3HwJtf03Koi62bDAJDx0rF_GGwf1wU-8g_zQpTbHslx7kwF2ZNG6vnCYmyj8qYh5iRt6h_QksHrK2qs0Xt9knYU9wepW2AdIFFsQOO4BiTKIg_wSH14XU5EpDcsz4VoHKdc8AvfaSBhVs5i3UbAqlb-Ggtz3jClW3I4FmWAX8aLq88RMVMCDXia-FRa0WGDr4eK5P-IMsjYRCfAxfaLfJK3wlrh2ilRynclErJHdTmWIfyDtQPBHB9AveFsCyFqU",
    alt: "Deluxe suite main view",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7R9YbQrG52BvSMOXKo_FwvaChF5TayX6Hqy2zpgC03ov27amvidRkMWspcsNQW9N1eY6uAgBk5wBnTqQkoy_bUIQNC3WkyYJrfr7uOP_U8d66jdwuBqx4pd8KrkZabiTgvsTYclXxPNSzq2VjV84P_UJOj0iL92JoSoidvcN2C7uDXKW4mXPLGIC7LHXbo7itlaDMN2SGN02E74s6E5FfqD5PEM9cH4ix9GGozezaqGhFmZqJ2YyOiz9WiWg-iwbAxlrPXAirzmg",
    alt: "Modern bathroom",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB48XwyK8O4wmAevt-FFqC5upwkw6V0Ajb-M8vuzjc8NsI3zLXXwYY3yiuLhw4SCXIxqmgTufYkNTkC9Gwx7aTXp9h4ZjHXxdKmMdgtC8ePDeAsZwmvAYuEsz-PLuTvr9PjBBA_a_D0CuiSTGfKZ_teJe7WpvIchBjuF_O4u4CkfuqJgjJTpdQfQeXJkdJN-LSqamWIjehok1T1G7QM2NDrcXRm7Qdhq_IZqqVgI60MY6Ulrlj5JTfEYnY1a9IS7R-aWzc5FIPH8ho",
    alt: "Infinity pool",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDLLiyQSg3o-JObHqquDb71Qqnogs4tUBwBNmkeIvj8dAl6pEZkW0zDp-JQyduG1laUuMBN-fT3NBZN0MphMpWtXIbleEv5_gCnWWxTGeiIJRDed1Ui3JfQCTeiYCr-Y6wR4Wp8KVHjWsMj8TLRCJkI3F7S7CxnXLUqFjHAOyi7TNQHCny68Cie1k2U9OyvgqFi5F3-L4352guRSFMvFTA0w715GyTorSCu3YmEkxoWpuup1HtOtVfc1TzgPZ30wkwgbLUcfJvXTk",
    alt: "Gourmet breakfast",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCxsiqI3-9RzhGHpzH7saB4Ob8pzEsia-3o0h6VlTDAP3zwsYhTasNA8doCp5f7NBglVP__xSuc6An8prmPEYbyOxq4lxEf_r-hj6yo-uKoUVfxKSrzpoOrP0eB55NcGLADami97xac5HZxNW6ngae1vf1fqrmPGYDtrPEsstRf-vpAZTG3Z2bq38GdqUKrgbNxiptXOsCz6gxew0prn_gT7EMA_si_GRNs7fAm61BYldktHrJOTNcNB8q5jxEKYxDAOLhkkmP4FZQ",
    alt: "Lounge area",
  },
];

const CALENDAR_WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const SERVICE_FEE_RATE = 0.1183333333;
const OCCUPANCY_TAX_RATE = 0.0616666667;

export const ROOM_DETAILS_AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCkByTUw8w_YyyVdzwDJR2fv7Wj3spfhVFfCRN3KVmJhSvgvO5YmvhScZW0kixPaDzr0LH1sfxYzS853J3_rkfEb_pcYr6yYgUkPb1s9WbYXh_jvvab4UI_Q5fvKMrFfe4FcskL-ZOTr8aZAUZrwqPo3OwKNIa4wdv-2gHEgaNhX1MxCxuuamVtadcclezWN-QZWtEk5qTKiba7vT8qZbgd-hnsUSQ8VZxFYmYvSssw5tkJpGR7Pm8LidHU1dq2kzs5FqhY8xefyFc";

export const ROOM_DETAILS_HEADER_ITEMS = [
  { label: "Hotels", href: "/rooms", active: true },
  { label: "Resorts" },
  { label: "Cabins" },
  { label: "Villas" },
];

export const ROOM_DETAILS_BOTTOM_NAV_ITEMS = [
  { label: "Explore", icon: "search", href: "/rooms" },
  { label: "Saved", icon: "favorite" },
  { label: "Bookings", icon: "calendar_today", active: true },
  { label: "Profile", icon: "person" },
];

function getIntroParagraphs(description?: string): string[] {
  const paragraphs = description
    ?.split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs || paragraphs.length === 0) {
    return [];
  }

  return paragraphs.slice(0, 2);
}

function getGalleryImages(room: RoomDetailsInput): RoomImage[] {
  const images =
    room.image_urls?.filter((image) => image.trim().length > 0) ?? [];

  if (images.length > 0) {
    return images.map((image, index) => ({
      src: image,
      alt: `${room.title} image ${index + 1}`,
    }));
  }

  if (!room.image_url) {
    return DEFAULT_IMAGES;
  }

  return [
    {
      src: room.image_url,
      alt: `${room.title} main view`,
    },
    ...DEFAULT_IMAGES.slice(1),
  ];
}

export function getFallbackRoom(roomId: string): RoomDetailsInput {
  const parsedId = Number(roomId);

  return {
    id: Number.isFinite(parsedId) ? parsedId : 1,
    title: "Deluxe Ocean View Suite",
    price: 1200,
    image_url: DEFAULT_IMAGES[0].src,
    description: "",
    location: "",
  };
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatMonthLabel(date: Date): string {
  return monthFormatter.format(date);
}

export function formatBookingDate(date: Date): string {
  return bookingDateFormatter.format(date);
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function normalizeTimeValue(value: string): string {
  const [hours = "00", minutes = "00"] = value.split(":");

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

function formatSlotClock(value: string): string {
  const [hoursString = "0", minutes = "00"] = normalizeTimeValue(value).split(
    ":",
  );
  const hours = Number(hoursString);

  if (!Number.isFinite(hours)) {
    return value;
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHour = hours % 12 || 12;

  return minutes === "00"
    ? `${normalizedHour} ${suffix}`
    : `${normalizedHour}:${minutes} ${suffix}`;
}

function buildSlotKey(startTime: string, endTime: string): string {
  return `${normalizeTimeValue(startTime)}-${normalizeTimeValue(endTime)}`;
}

function buildSlotLabel(startTime: string, endTime: string, index: number): string {
  const slotKey = buildSlotKey(startTime, endTime);

  const matchedSlot = SLOT_DEFINITIONS.find(
    (slot) => buildSlotKey(slot.startTime, slot.endTime) === slotKey,
  );

  if (matchedSlot) {
    return matchedSlot.label;
  }

  return `Available Slot ${index + 1}`;
}

export function formatApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isPastMonth(month: Date, today: Date): boolean {
  return (
    month.getFullYear() < today.getFullYear() ||
    (month.getFullYear() === today.getFullYear() &&
      month.getMonth() < today.getMonth())
  );
}

export function getInitialSelectedDate(month: Date, today: Date): Date {
  if (
    month.getFullYear() === today.getFullYear() &&
    month.getMonth() === today.getMonth()
  ) {
    return startOfDay(today);
  }

  return new Date(month.getFullYear(), month.getMonth(), 1);
}

export function buildMiniCalendar(date: Date, today: Date): CalendarDay[] {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const previousMonthLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0,
  ).getDate();
  const leadingDays = monthStart.getDay();
  const minimumDate = startOfDay(today);
  const calendarDays: CalendarDay[] = [];

  for (let index = leadingDays - 1; index >= 0; index -= 1) {
    const value = previousMonthLastDay - index;

    calendarDays.push({
      value,
      label: String(value),
      muted: true,
      disabled: true,
    });
  }

  for (let value = 1; value <= daysInMonth; value += 1) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), value);

    calendarDays.push({
      value,
      label: String(value),
      date: currentDate,
      disabled: startOfDay(currentDate).getTime() < minimumDate.getTime(),
    });
  }

  const trailingDays = (7 - (calendarDays.length % 7)) % 7;

  for (let value = 1; value <= trailingDays; value += 1) {
    calendarDays.push({
      value,
      label: String(value),
      muted: true,
      disabled: true,
    });
  }

  return calendarDays;
}

export function buildDefaultTimeSlots(basePrice: number): RoomTimeSlot[] {
  return SLOT_DEFINITIONS.map((slot) => ({
    id: slot.id,
    time: `${formatSlotClock(slot.startTime)} - ${formatSlotClock(slot.endTime)}`,
    label: slot.label,
    price: basePrice,
    startTime: slot.startTime,
    endTime: slot.endTime,
  }));
}

export function buildTimeSlotsFromApi(
  slots:
    | Array<{ id: number; startTime: string; endTime: string }>
    | undefined,
  basePrice: number,
): RoomTimeSlot[] {
  if (slots && slots.length > 0) {
    return slots.map((slot, index) => ({
      id: buildSlotKey(slot.startTime, slot.endTime),
      slotId: slot.id,
      time: `${formatSlotClock(slot.startTime)} - ${formatSlotClock(slot.endTime)}`,
      label: buildSlotLabel(slot.startTime, slot.endTime, index),
      price: basePrice,
      startTime: slot.startTime,
      endTime: slot.endTime,
      disabled: false,
    }));
  }

  return [];
}

export function getBookingBreakdown(basePrice: number) {
  const serviceFee = Math.round(basePrice * SERVICE_FEE_RATE);
  const occupancyTaxes = Math.round(basePrice * OCCUPANCY_TAX_RATE);
  const total = basePrice + serviceFee + occupancyTaxes;

  return {
    serviceFee,
    occupancyTaxes,
    total,
  };
}

export function buildRoomDetailsViewModel(
  room: RoomDetailsInput,
): RoomDetailsViewModel {
  const basePrice = room.price > 0 ? room.price : 1200;
  const amenities: RoomAmenity[] =
    room.amenities?.map((amenity) => ({
      icon: "check_circle",
      label: amenity.label,
      iconUrl: amenity.iconUrl,
    })) ?? [];

  return {
    title: room.title || "Deluxe Ocean View Suite",
    location: room.location?.trim() ?? "",
    introHeading: "About this room",
    introParagraphs: getIntroParagraphs(room.description),
    images: getGalleryImages(room),
    amenities,
    calendarWeekdays: CALENDAR_WEEKDAYS,
    timeSlots: buildDefaultTimeSlots(basePrice),
    defaultDate: getInitialSelectedDate(new Date(), new Date()).getDate(),
    defaultSlotId: buildDefaultTimeSlots(basePrice)[0]?.id ?? "",
    basePrice,
  };
}
