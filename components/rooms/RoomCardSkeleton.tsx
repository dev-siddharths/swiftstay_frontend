export default function RoomCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-3xl overflow-hidden animate-pulse flex flex-col">
      <div className="h-72 bg-surface-container-high" />
      <div className="p-6 flex flex-col flex-grow gap-4">
        <div className="h-5 w-3/4 bg-surface-container-high rounded-full" />
        <div className="h-4 w-1/2 bg-surface-container-high rounded-full" />
        <div className="mt-auto pt-6 flex items-center justify-between border-t border-surface-container-high">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-surface-container-high rounded-full" />
            <div className="h-5 w-24 bg-surface-container-high rounded-full" />
          </div>
          <div className="h-10 w-28 bg-surface-container-high rounded-xl" />
        </div>
      </div>
    </div>
  );
}
