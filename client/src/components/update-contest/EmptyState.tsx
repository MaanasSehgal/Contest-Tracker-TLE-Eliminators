import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Search } from "lucide-react";

interface EmptyStateProps {
  isSearchMode: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ isSearchMode }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        {isSearchMode ? (
          <Search className="w-16 h-16 text-gray-300 dark:text-darkText-600" />
        ) : (
          <AlertCircle className="w-16 h-16 text-gray-300 dark:text-darkText-600" />
        )}
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gray-700 dark:text-darkText-300 mb-2">
        {isSearchMode ? "No results found" : "No contests available"}
      </h3>
      
      <p className="text-gray-500 dark:text-darkText-400 text-center max-w-md">
        {isSearchMode 
          ? "Try adjusting your search terms or filters to find what you're looking for."
          : "There are no contests available with the current filter settings."}
      </p>
    </div>
  );
};

export default EmptyState;
