export type RoomBadgeVariant =
  | "primary"
  | "dark"
  | "tertiary"
  | "tertiaryLight";

export interface RoomBadge {
  label: string;
  variant: RoomBadgeVariant;
}

export interface Room {
  id: number;
  title: string;
  price: number;
  image_url: string;
  description?: string;
  location?: string;
}
