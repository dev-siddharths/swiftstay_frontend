import type {
  BookingFilterStatus,
  BookingRecord,
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

export const BOOKING_MOCK_DATA: BookingRecord[] = [
  {
    id: "BK-4021",
    bookingId: 4021,
    title: "The Azure Executive Suite",
    location: "Santorini, Greece",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDXJ6OCCa16QEjXFigqhW5B3hAIc8NvLaiRcxQdW6F6pPmWqgqmjfIbjABkOb5RcLZ19WELWar0xp9hNujA8yJKKJ-9oQKDzftRoLjpaxE2yFO6ilPNiBuX5PBadllnBA1ebfou8nJYAanGLA9XTwTeNNDaohcjBuTjAias-CHQbUp8SyeeRYUCarjhq1sXWiLD40vh9A6mzGKgtGD7PvlUWo-PeszLlDuzXnan-Ewe8LYHLGF2zdfpf9XPFdDd0sIeclSRRKX49pc",
    status: "upcoming",
    totalPrice: 124000,
    dateLabel: "12 Apr - 15 Apr 2026",
    timeLabel: "Check-in at 2:00 PM",
    guestLabel: "2 Adults",
    stayType: "Executive Suite",
    dateISO: "2026-04-12T14:00:00.000Z",
    secondaryActionLabel: "Cancel booking",
  },
  {
    id: "BK-4078",
    bookingId: 4078,
    title: "Emerald Coast Residence",
    location: "Goa, India",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD44XIo9c3b4-CjI5Om1GFjC8DVJ7_8EkgW93taCdqTHHF1huU4r0S6gcb_m7f-qsUB2UI9s1fYr6tlP_ZUa85KlWS4z4h4bAmIfuYrmjUXz3evk7YhBkfqQY2KzV6m4qA3W0byW2l7u1n4Iru1fgM2YbJme5rO8iAHzImF5t9tO8W4YhHbDYIPqH0xkqAfYB9TWwJm8Y9X9CAbWsDDJ2iWhLFco8L5vZmyN0CgcfhxnZcv-C21aP5jgkMjQJXnYbJglA4jK8LUJw",
    status: "upcoming",
    totalPrice: 86500,
    dateLabel: "27 Apr - 30 Apr 2026",
    timeLabel: "Check-in at 1:00 PM",
    guestLabel: "4 Guests",
    stayType: "Sea-facing Villa",
    dateISO: "2026-04-27T13:00:00.000Z",
    actionLabel: "Manage stay",
    secondaryActionLabel: "Message host",
  },
  {
    id: "BK-3812",
    bookingId: 3812,
    title: "Aspen Ridge Cabin",
    location: "Aspen, Colorado",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC9KipFRYt4O4CCXkJlyYt51YLTMgxUvPKeMz8F6ZmsXv3x2S9ULt2p6gihjve5Xv19i1-iANrXm0VZY3lXAyV_rWiahGJ6ViEPAZb76iXewHJzRl4jkY2GwlIdB2hUYwHG3Qo3hiPwwKr5DgalXLcAL5WI7q9-4y_1odMi3Z3Mb39QNLOhRRziD1WOJu02cUuCYbNGcjfc7FE_B64IHScy2rn6JZnEXNDN5Nx9myWUTCL93BPq9O7PD65ugIaECapYEelsxDub2y8",
    status: "completed",
    totalPrice: 85000,
    dateLabel: "06 Feb - 09 Feb 2026",
    timeLabel: "Checked out at 10:00 AM",
    guestLabel: "2 Adults",
    stayType: "Whole Home",
    dateISO: "2026-02-06T10:00:00.000Z",
    actionLabel: "Leave review",
    secondaryActionLabel: "Download invoice",
  },
  {
    id: "BK-3764",
    bookingId: 3764,
    title: "Urban Loft Studio",
    location: "Berlin, Germany",
    status: "cancelled",
    totalPrice: 41100,
    dateLabel: "11 Mar - 13 Mar 2026",
    timeLabel: "Cancelled on 08 Mar 2026",
    guestLabel: "1 Adult",
    stayType: "Studio Loft",
    dateISO: "2026-03-11T16:00:00.000Z",
    actionLabel: "Rebook now",
    secondaryActionLabel: "View details",
  },
];
