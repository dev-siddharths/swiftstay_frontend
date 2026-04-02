import RoomCard from "./RoomCard";
import type { Room } from "./types";
import Pagination from "../shared/Pagination";

type RoomsGridProps = {
  rooms: Room[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  totalRooms: number;
};

export default function RoomsGrid({
  rooms,
  currentPage,
  onPageChange,
  totalPages,
  totalRooms,
}: RoomsGridProps) {
  return (
    <>
      <div className="mb-4 text-center md:text-left">
        <h2 className="font-headline text-[1.55rem] font-extrabold tracking-tight text-on-surface md:text-[1.7rem]">
          All Available Rooms
        </h2>
      </div>
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
  );
}
