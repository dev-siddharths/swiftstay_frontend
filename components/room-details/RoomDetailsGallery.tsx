"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { RoomImage } from "./roomDetails.types";

type RoomDetailsGalleryProps = {
  images: RoomImage[];
};

export default function RoomDetailsGallery({
  images,
}: RoomDetailsGalleryProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    setActiveIndex(clampedIndex);
    slider.scrollTo({
      left: slider.offsetWidth * clampedIndex,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider || slider.offsetWidth === 0) {
      return;
    }

    const nextIndex = Math.round(slider.scrollLeft / slider.offsetWidth);
    setActiveIndex(Math.max(0, Math.min(nextIndex, images.length - 1)));
  };

  return (
    <section className="relative h-[460px] mb-12 rounded-3xl overflow-hidden group">
      <div
        ref={sliderRef}
        className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        onScroll={handleScroll}
      >
        {images.map((image, index) => (
          <div
            key={`${image.src}-${index}`}
            className="relative flex-shrink-0 w-full h-full snap-center"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous image"
        onClick={() => scrollToIndex(activeIndex - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
      >
        <span className="material-symbols-outlined text-3xl">
          chevron_left
        </span>
      </button>
      <button
        type="button"
        aria-label="Next image"
        onClick={() => scrollToIndex(activeIndex + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 shadow-lg"
      >
        <span className="material-symbols-outlined text-3xl">
          chevron_right
        </span>
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((image, index) => (
          <button
            key={`${image.alt}-${index}`}
            type="button"
            aria-label={`Go to image ${index + 1}`}
            onClick={() => scrollToIndex(index)}
            className={
              index === activeIndex
                ? "w-2.5 h-2.5 rounded-full bg-white shadow-sm transition-all duration-300"
                : "w-2.5 h-2.5 rounded-full bg-white/40 shadow-sm transition-all duration-300"
            }
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </section>
  );
}
