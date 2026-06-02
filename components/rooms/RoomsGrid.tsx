import RoomCard from "./RoomCard";
import type { Room } from "./types";
import Pagination from "../shared/Pagination";

type RoomsGridProps = {
  rooms: Room[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalRooms: number;
  errorMessage?: string | null;
};

export default function RoomsGrid({
  rooms,
  currentPage,
  onPageChange,
  totalPages,
  totalRooms,
  errorMessage,
}: RoomsGridProps) {
  return (
    <>
      <div className="mb-4 text-center md:text-left">
        <h2 className="font-headline text-[1.55rem] font-extrabold tracking-tight text-on-surface md:text-[1.7rem]">
          All Available Rooms
        </h2>
      </div>
      {rooms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            itemLabel="rooms"
            totalItems={totalRooms}
            className="mt-5"
          />
        </>
      ) : (
        <div className="rounded-[20px] border border-outline-variant/20 bg-surface-container-lowest px-5 py-10 text-center shadow-[0_12px_28px_rgba(27,28,28,0.04)]">
          <h3 className="font-headline text-[1.2rem] font-extrabold text-on-surface">
            No rooms found
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
            {errorMessage ??
              "There are no rooms available right now. Please check back later."}
          </p>
        </div>
      )}
    </>
  );
}
