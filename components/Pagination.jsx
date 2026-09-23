'use client';

export default function Pagination({ currentPage, totalPages, startItem, endItem, total, onPageChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow gap-4">
      <p className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {total}
      </p>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-100"
        >
          Previous
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded border px-3 py-1 text-sm disabled:opacity-50 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}