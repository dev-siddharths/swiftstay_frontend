import Image from "next/image";
import Link from "next/link";
import type { Room } from "./types";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

type RoomCardProps = {
  room: Room;
};

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[24px] bg-surface-container-lowest transition-all duration-500 hover:shadow-[0_16px_36px_rgba(169,50,0,0.1)]">
      <div className="relative h-48 overflow-hidden">
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
      <div className="flex flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <h3 className="font-headline text-[1.1rem] font-semibold leading-snug text-on-surface">
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
          <p className="mb-2.5 text-[13px] font-medium text-on-surface-variant/80">
            {room.location}
          </p>
        ) : null}
        <div className="flex items-end justify-between border-t border-surface-container-high pt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-on-surface-variant/75">
              Per slot
            </span>
            <span className="font-headline text-[1.05rem] font-bold text-primary">
              {formatPrice(room.price)}
            </span>
          </div>
          <Link
            href={`/rooms/${room.id}`}
            className="rounded-lg bg-primary px-3.5 py-1.5 text-[14px] font-medium text-on-primary transition-all hover:bg-primary-container active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
