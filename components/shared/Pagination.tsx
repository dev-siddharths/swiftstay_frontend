"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemLabel: string;
  totalItems: number;
  className?: string;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set<number>([1, totalPages, currentPage]);

  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }

  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  return [...pages].sort((left, right) => left - right);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemLabel,
  totalItems,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav
      aria-label={`${itemLabel} pagination`}
      className={`flex flex-col gap-3 rounded-[20px] border border-outline-variant/15 bg-surface-container-lowest px-4 py-4 shadow-[0_12px_30px_rgba(27,28,28,0.04)] sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      <p className="text-sm text-on-surface-variant">
        Page{" "}
        <span className="font-semibold text-on-surface">{currentPage}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalPages}</span>
        {" · "}
        {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-outline-variant/25 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <div className="flex items-center gap-1">
          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1];
            const shouldShowGap =
              previousPage !== undefined && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center gap-1">
                {shouldShowGap ? (
                  <span className="px-1 text-sm text-on-surface-variant/60">
                    ...
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onPageChange(page)}
                  aria-current={currentPage === page ? "page" : undefined}
                  className={`min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-on-primary"
                      : "text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  {page}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-outline-variant/25 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
