"use client";

export default function Pagination({
  currentPage,
  totalPages,
  startItem,
  endItem,
  total,
  onPageChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow gap-4">
      <p className="text-sm font-semibold text-gray-900">
        Showing {startItem || 0}-{endItem || 0} of {total || 0}
      </p>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-md border border-gray-400 px-4 py-2 text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm font-bold text-gray-900">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-md border border-gray-400 px-4 py-2 text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
