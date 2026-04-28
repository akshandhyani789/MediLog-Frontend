import React from "react";

export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div className="flex justify-end items-center gap-2 mt-4">

      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`w-8 h-8 rounded-full text-sm font-medium ${
            page === i + 1
              ? "bg-teal-600 text-white shadow"
              : "border hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}