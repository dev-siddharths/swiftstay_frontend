const categories = [
  { label: "Beachfront", icon: "beach_access", active: true },
  { label: "City Views", icon: "apartment" },
  { label: "Houseboats", icon: "houseboat" },
  { label: "Heritage", icon: "castle" },
  { label: "Nature", icon: "forest" },
];

export default function RoomsFilters() {
  return (
    <section className="mb-12">
      <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 md:gap-8">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            location_on
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            placeholder="Where are you going?"
            type="text"
          />
        </div>
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            calendar_month
          </span>
          <input
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
            placeholder="Check-in - Check-out"
            type="text"
          />
        </div>
        <div className="flex-none w-full md:w-auto">
          <button
            type="button"
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl scale-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
            Filters
          </button>
        </div>
      </div>
      <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category.label}
            type="button"
            className={
              category.active
                ? "flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-full border border-primary/20 whitespace-nowrap text-sm font-bold"
                : "flex items-center gap-2 px-5 py-2.5 bg-surface-container-low text-on-surface-variant rounded-full hover:bg-surface-container-high transition-colors whitespace-nowrap text-sm font-medium"
            }
          >
            <span
              className="material-symbols-outlined text-lg"
              style={{ fontVariationSettings: category.active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {category.icon}
            </span>
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}
