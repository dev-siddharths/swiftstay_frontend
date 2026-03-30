import Image from "next/image";
import type { RoomAmenity } from "./roomDetails.types";

type RoomAmenitiesProps = {
  amenities: RoomAmenity[];
};

export default function RoomAmenities({ amenities }: RoomAmenitiesProps) {
  return (
    <section className="mb-12 p-8 bg-surface-container-low rounded-2xl">
      <h2 className="text-xl font-semibold leading-normal mb-8">
        Premium Amenities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8">
        {amenities.map((amenity) => (
          <div key={amenity.label} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary">
              {amenity.iconUrl ? (
                <Image
                  src={amenity.iconUrl}
                  alt={amenity.label}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              ) : (
                <span className="material-symbols-outlined">{amenity.icon}</span>
              )}
            </div>
            <span className="text-sm font-medium leading-normal text-on-surface-variant">
              {amenity.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
