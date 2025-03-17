import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      }

      if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center p-4 md:p-6 border-t border-gray-100 dark:border-darkBorder-800">
      <div className="flex items-center space-x-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md text-gray-600 dark:text-darkText-400 hover:bg-gray-100 dark:hover:bg-darkBox-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500 dark:text-darkText-500">
                ...
              </span>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className={`px-3 py-1 rounded-md transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-darkText-300 hover:bg-gray-100 dark:hover:bg-darkBox-800"
                }`}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            currentPage < totalPages && onPageChange(currentPage + 1)
          }
          disabled={currentPage === totalPages}
          className="p-2 rounded-md text-gray-600 dark:text-darkText-400 hover:bg-gray-100 dark:hover:bg-darkBox-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;
