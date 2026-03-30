import RoomCard from "./RoomCard";
import type { Room } from "./types";

type RoomsGridProps = {
  rooms: Room[];
};

export default function RoomsGrid({ rooms }: RoomsGridProps) {
  return (
    <>
      <h2 className="text-3xl mb-5 ml-1 text-center">All Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </>
  );
}
