
import React from "react";

export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  const buttonBase =
    "flex h-9 min-w-9 items-center justify-center rounded-xl border px-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00C2C7]/20 disabled:cursor-not-allowed disabled:opacity-30";

  const inactiveButton =
    "border-white/[0.09] bg-white/[0.025] text-gray-400 hover:border-[#00C2C7]/30 hover:bg-[#00C2C7]/[0.07] hover:text-[#00C2C7]";

  const activeButton =
    "border-[#00C2C7]/30 bg-[#00C2C7] text-[#061112] shadow-[0_0_16px_rgba(0,194,199,0.15)]";

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      {/* Page information */}
      <p className="text-xs text-gray-500">
        Page{" "}
        <span className="font-semibold text-gray-200">{page}</span>
        {" "}of{" "}
        <span className="font-semibold text-gray-200">{totalPages}</span>
      </p>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className={`${buttonBase} ${inactiveButton}`}
          aria-label="Previous page"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={page === pageNumber ? "page" : undefined}
              className={`${buttonBase} !h-9 !w-9 !min-w-0 !rounded-xl !px-0 ${
                page === pageNumber ? activeButton : inactiveButton
              }`}
            >
              {pageNumber}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={`${buttonBase} ${inactiveButton}`}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
