import Image from "next/image";
import Link from "next/link";
import type { Room, RoomBadgeVariant } from "./types";

// const badgeStyles: Record<RoomBadgeVariant, string> = {
//   primary:
//     "bg-primary-container text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
//   dark: "bg-on-surface/80 backdrop-blur-md text-surface-bright px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
//   tertiary:
//     "bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
//   tertiaryLight:
//     "bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
// };

const formatPrice = (price: number) =>
  `₹${new Intl.NumberFormat("en-IN").format(price)}`;

type RoomCardProps = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group bg-surface-container-lowest rounded-3xl overflow-hidden hover:shadow-[0_20px_50px_rgba(169,50,0,0.1)] transition-all duration-500 flex flex-col">
      <div className="relative h-72 overflow-hidden">
        <Image
          src={room.image_url}
          alt={room.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* {room.badges && room.badges.length > 0 ? (
          <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
            {room.badges.map((badge) => (
              <span key={badge.label} className={badgeStyles[badge.variant]}>
                {badge.label}
              </span>
            ))}
          </div>
        ) : null} */}
        {/* <button
          type="button"
          aria-label={room.isFavorite ? "Remove from favorites" : "Save room"}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface/60 backdrop-blur-md flex items-center justify-center text-primary transition-transform active:scale-90"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings: room.isFavorite ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button> */}
      </div>
      <div className="p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="font-headline text-xl font-bold text-on-surface">
            {room.title}
          </h3>
          {/* {room.rating ? (
            <div className="flex items-center gap-1">
              <span
                className="material-symbols-outlined text-primary text-lg"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span className="text-sm font-bold">
                {room.rating.toFixed(1)}
              </span>
            </div>
          ) : null} */}
        </div>
        {room.location ? (
          <p className="text-on-surface-variant text-sm flex items-center gap-1 mb-4">
            {room.location}
          </p>
        ) : null}
        <div className="pt-6 flex items-center justify-between border-t border-surface-container-high">
          <div className="flex flex-col">
            <span className="text-xs text-on-surface-variant font-medium">
              Per night
            </span>
            <span className="text-xl font-headline font-extrabold text-primary">
              {formatPrice(room.price)}
            </span>
          </div>
          <Link
            href={`/rooms/${room.id}`}
            className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-xl hover:bg-primary-container active:scale-95 transition-all text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
