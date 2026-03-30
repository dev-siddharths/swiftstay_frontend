export interface RoomImage {
  src: string;
  alt: string;
}

export interface RoomAmenity {
  icon: string;
  label: string;
  iconUrl?: string;
}

export interface CalendarDay {
  value: number;
  label: string;
  date?: Date;
  muted?: boolean;
  disabled?: boolean;
}

export interface RoomTimeSlot {
  id: string;
  time: string;
  label: string;
  price: number;
  disabled?: boolean;
  startTime?: string;
  endTime?: string;
}

export interface RoomDetailsViewModel {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  introHeading: string;
  introParagraphs: string[];
  images: RoomImage[];
  amenities: RoomAmenity[];
  calendarWeekdays: string[];
  timeSlots: RoomTimeSlot[];
  defaultDate: number;
  defaultSlotId: string;
  basePrice: number;
}

export interface RoomDetailsAmenityInput {
  label: string;
  iconUrl?: string;
}

export interface RoomDetailsInput {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  image_urls?: string[];
  description?: string;
  location?: string;
  amenities?: RoomDetailsAmenityInput[];
}
