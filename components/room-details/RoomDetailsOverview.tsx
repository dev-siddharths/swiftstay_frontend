type RoomDetailsOverviewProps = {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  introHeading: string;
  introParagraphs: string[];
};

export default function RoomDetailsOverview({
  title,
  location,
  rating,
  reviewCount,
  introHeading,
  introParagraphs,
}: RoomDetailsOverviewProps) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface tracking-tight leading-normal mb-4">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-on-surface-variant leading-normal">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-lg">
              location_on
            </span>
            <span className="font-medium">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="material-symbols-outlined text-primary text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            <span className="font-semibold text-on-surface">
              {rating.toFixed(1)}
            </span>
            <span className="opacity-70 text-xs">({reviewCount} Reviews)</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-outline-variant/15 w-full mb-10" />

      <section className="mb-12">
        <h2 className="text-xl font-semibold leading-normal mb-6">
          {introHeading}
        </h2>
        {introParagraphs.map((paragraph, index) => (
          <p
            key={`${paragraph.slice(0, 40)}-${index}`}
            className={
              index === introParagraphs.length - 1
                ? "text-base leading-relaxed text-secondary"
                : "text-base leading-relaxed text-secondary mb-6"
            }
          >
            {paragraph}
          </p>
        ))}
      </section>
    </>
  );
}
