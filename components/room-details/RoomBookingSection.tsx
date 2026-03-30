import { formatCurrency } from "./roomDetails.data";
import type { CalendarDay, RoomTimeSlot } from "./roomDetails.types";

type RoomBookingSectionProps = {
  monthLabel: string;
  weekdays: string[];
  calendarDays: CalendarDay[];
  selectedDate: Date;
  onDateSelect: (day: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  canGoToPreviousMonth: boolean;
  timeSlots: RoomTimeSlot[];
  selectedSlotId: string;
  onSlotSelect: (slotId: string) => void;
  isLoadingSlots: boolean;
  slotsError: string | null;
};

export default function RoomBookingSection({
  monthLabel,
  weekdays,
  calendarDays,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  canGoToPreviousMonth,
  timeSlots,
  selectedSlotId,
  onSlotSelect,
  isLoadingSlots,
  slotsError,
}: RoomBookingSectionProps) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold leading-normal mb-8">
        Reserve Your Time
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-base font-semibold leading-normal">
              {monthLabel}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={onPreviousMonth}
                disabled={!canGoToPreviousMonth}
                className="material-symbols-outlined p-1 hover:bg-surface-container-low rounded-full disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
              >
                chevron_left
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={onNextMonth}
                className="material-symbols-outlined p-1 hover:bg-surface-container-low rounded-full"
              >
                chevron_right
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-on-surface-variant mb-2">
            {weekdays.map((weekday, index) => (
              <div key={`${weekday}-${index}`}>{weekday}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm leading-normal">
            {calendarDays.map((day, index) =>
              day.muted ? (
                <div key={`${day.label}-${index}`} className="p-2 opacity-20">
                  {day.label}
                </div>
              ) : (
                <button
                  key={`${day.value}-${index}`}
                  type="button"
                  disabled={day.disabled || !day.date}
                  aria-pressed={day.date?.toDateString() === selectedDate.toDateString()}
                  onClick={() => {
                    if (day.date && !day.disabled) {
                      onDateSelect(day.date);
                    }
                  }}
                  className={
                    day.disabled
                      ? "p-2 opacity-30 rounded-lg cursor-not-allowed"
                      : day.date?.toDateString() === selectedDate.toDateString()
                      ? "p-2 bg-primary text-white font-semibold rounded-lg cursor-pointer"
                      : "p-2 hover:bg-primary-fixed rounded-lg cursor-pointer"
                  }
                >
                  {day.label}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-on-surface-variant mb-4 flex items-center gap-2 leading-normal">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Available Time Slots
          </h3>

          {isLoadingSlots ? (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 text-sm text-on-surface-variant">
              Loading time slots...
            </div>
          ) : slotsError ? (
            <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4 text-sm text-on-surface-variant">
              {slotsError}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;

                if (slot.disabled) {
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled
                      className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 opacity-40 cursor-not-allowed bg-surface-container-low"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold leading-normal">
                          {slot.time}
                        </span>
                        <span className="text-xs leading-normal">
                          {slot.label}
                        </span>
                      </div>
                      <span className="text-sm font-semibold">Fully Booked</span>
                    </button>
                  );
                }

                if (isSelected) {
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      aria-pressed="true"
                      onClick={() => onSlotSelect(slot.id)}
                      className="flex items-center justify-between p-4 rounded-xl border-2 border-[#f15a24] bg-[#f15a24]/5 shadow-[0_0_15px_rgba(241,90,36,0.1)]"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold leading-normal text-primary">
                          {slot.time}
                        </span>
                        <span className="text-xs leading-normal text-primary">
                          {slot.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-sm font-semibold">
                          {formatCurrency(slot.price)}
                        </span>
                        <span
                          className="material-symbols-outlined text-[#f15a24]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                      </div>
                    </button>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed="false"
                    onClick={() => onSlotSelect(slot.id)}
                    className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-primary-fixed/30 transition-colors group"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold leading-normal group-hover:text-primary">
                        {slot.time}
                      </span>
                      <span className="text-xs leading-normal text-on-surface-variant">
                        {slot.label}
                      </span>
                    </div>
                    <span className="text-primary text-sm font-semibold">
                      {formatCurrency(slot.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
