import React from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 md:mb-8 max-w-xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search
            size={18}
            className="text-gray-400 dark:text-darkText-500"
          />
        </div>
        <input
          type="text"
          placeholder="Search by contest name or problem..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-darkBorder-800 bg-white dark:bg-darkBox-900 text-gray-700 dark:text-darkText-300 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-purple-500 transition-colors duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-darkText-500 dark:hover:text-darkText-300"
          >
            <span className="text-xl">&times;</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;
