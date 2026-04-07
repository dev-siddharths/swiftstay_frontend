import RoomCardSkeleton from "@/components/rooms/RoomCardSkeleton";

export default function RoomsLoading() {
  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <RoomCardSkeleton key={`room-skeleton-${index}`} />
          ))}
        </div>
      </main>
    </div>
  );
}
