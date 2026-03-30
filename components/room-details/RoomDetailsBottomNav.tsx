import Link from "next/link";
import { ROOM_DETAILS_BOTTOM_NAV_ITEMS } from "./roomDetails.data";

type RoomDetailsBottomNavProps = {
  roomId: string;
};

export default function RoomDetailsBottomNav({
  roomId,
}: RoomDetailsBottomNavProps) {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 bg-surface/90 backdrop-blur-lg z-50 shadow-[0_-8px_32px_0_rgba(27,28,28,0.12)]"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
    >
      {ROOM_DETAILS_BOTTOM_NAV_ITEMS.map((item) => {
        const content = (
          <>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-body text-[10px] font-semibold uppercase tracking-wider">
              {item.label}
            </span>
          </>
        );

        const className = item.active
          ? "flex flex-col items-center justify-center bg-primary text-white rounded-2xl p-2 px-4 scale-110"
          : "flex flex-col items-center justify-center text-on-surface opacity-60";

        if (item.href) {
          return (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={`/rooms/${roomId}`}
            className={className}
            aria-current={item.active ? "page" : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
