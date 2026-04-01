import { formatCurrency } from "./roomDetails.data";

type RoomBookingSidebarProps = {
  basePrice: number;
  selectedDateLabel: string;
  selectedSlotLabel: string;
  serviceFee: number;
  occupancyTaxes: number;
  total: number;
  onBookNow: () => void | Promise<void>;
  isBooking: boolean;
  isBookDisabled: boolean;
};

export default function RoomBookingSidebar({
  basePrice,
  selectedDateLabel,
  selectedSlotLabel,
  serviceFee,
  occupancyTaxes,
  total,
  onBookNow,
  isBooking,
  isBookDisabled,
}: RoomBookingSidebarProps) {
  return (
    <div className="sticky top-28 bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_rgba(27,28,28,0.08)] border border-outline-variant/10">
      <div className="flex items-baseline gap-2 mb-8">
        <span className="text-2xl font-bold leading-normal text-on-surface">
          {formatCurrency(basePrice)}
        </span>
        <span className="text-sm leading-normal text-secondary font-medium">
          / slot
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">
            Check-in Date
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold leading-normal">
              {selectedDateLabel}
            </span>
            <span className="material-symbols-outlined text-primary text-lg">
              calendar_month
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant opacity-60 mb-1">
            Time Slot
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold leading-normal">
              {selectedSlotLabel}
            </span>
            <span className="material-symbols-outlined text-primary text-lg">
              schedule
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8 text-sm leading-normal">
        <div className="flex justify-between text-secondary">
          <span>1 Slot x {formatCurrency(basePrice)}</span>
          <span className="font-medium text-on-surface">
            {formatCurrency(basePrice)}
          </span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>Service Fee</span>
          <span className="font-medium text-on-surface">
            {formatCurrency(serviceFee)}
          </span>
        </div>
        <div className="flex justify-between text-secondary">
          <span>Occupancy Taxes</span>
          <span className="font-medium text-on-surface">
            {formatCurrency(occupancyTaxes)}
          </span>
        </div>
        <div className="h-px bg-outline-variant/15 w-full pt-2" />
        <div className="flex justify-between items-baseline pt-2">
          <span className="text-lg font-semibold leading-normal">Total</span>
          <span className="text-xl font-bold leading-normal text-primary">
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          void onBookNow();
        }}
        disabled={isBookDisabled}
        className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all mb-4 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {isBooking ? "Booking..." : "Book Now"}
      </button>
      <p className="text-center text-xs text-on-surface-variant">
        You won&apos;t be charged yet
      </p>

      <div className="mt-8 flex items-center justify-center gap-2 text-primary">
        <span className="material-symbols-outlined text-sm">verified_user</span>
        <span className="text-xs font-bold uppercase tracking-tighter">
          Best Price Guaranteed
        </span>
      </div>
    </div>
  );
}
