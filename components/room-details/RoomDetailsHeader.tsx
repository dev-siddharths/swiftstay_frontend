import Image from "next/image";
import Link from "next/link";
import {
  ROOM_DETAILS_AVATAR_SRC,
  ROOM_DETAILS_HEADER_ITEMS,
} from "./roomDetails.data";

type RoomDetailsHeaderProps = {
  userName?: string;
};

export default function RoomDetailsHeader({
  userName,
}: RoomDetailsHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl transition-all">
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-screen-2xl mx-auto">
        <Link
          href="/rooms"
          className="text-2xl font-black text-primary tracking-tight"
        >
          SwiftStay
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {ROOM_DETAILS_HEADER_ITEMS.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className={
                  item.active
                    ? "font-headline font-bold text-lg tracking-tight text-primary border-b-2 border-primary pb-1"
                    : "font-headline font-bold text-lg tracking-tight text-on-surface opacity-70 hover:opacity-100 transition-opacity duration-200"
                }
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                className="font-headline font-bold text-lg tracking-tight text-on-surface opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                {item.label}
              </button>
            ),
          )}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="material-symbols-outlined p-2 text-on-surface opacity-70 scale-95 active:scale-90 transition-transform"
          >
            notifications
          </button>
          <button
            type="button"
            aria-label="Favorites"
            className="material-symbols-outlined p-2 text-on-surface opacity-70 scale-95 active:scale-90 transition-transform"
          >
            favorite
          </button>
          <button
            type="button"
            aria-label={userName ? `${userName} profile avatar` : "Profile avatar"}
            className="w-10 h-10 rounded-full bg-surface-container overflow-hidden"
            title={userName}
          >
            <Image
              src={ROOM_DETAILS_AVATAR_SRC}
              alt="User profile avatar"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
