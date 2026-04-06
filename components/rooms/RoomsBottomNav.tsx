import Link from "next/link";

export default function RoomsBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-surface/80 backdrop-blur-xl z-50 rounded-t-3xl shadow-[0_-8px_32px_rgba(27,28,28,0.12)]">
      <Link
        className="flex flex-col items-center justify-center text-primary bg-primary-container/10 rounded-xl px-4 py-2 transition-all duration-200"
        href="/rooms"
      >
        <span className="material-symbols-outlined">home</span>
        <span className="font-body text-[10px] font-semibold uppercase tracking-widest mt-1">
          Home
        </span>
      </Link>
      <Link
        className="flex flex-col items-center justify-center text-on-surface/60 px-4 py-2 transition-all duration-200"
        href="/bookings"
      >
        <span className="material-symbols-outlined">event_note</span>
        <span className="font-body text-[10px] font-semibold uppercase tracking-widest mt-1">
          Bookings
        </span>
      </Link>
      <Link
        className="flex flex-col items-center justify-center text-on-surface/60 px-4 py-2 transition-all duration-200"
        href="/rooms"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="font-body text-[10px] font-semibold uppercase tracking-widest mt-1">
          Profile
        </span>
      </Link>
    </nav>
  );
}
