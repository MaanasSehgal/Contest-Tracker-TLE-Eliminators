import { Search, X } from "lucide-react";

interface SearchFiltersProps {
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm = "",
  setSearchTerm = () => {},
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by contest name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 pl-10 border border-gray-200 dark:border-darkBorder-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkBox-850 dark:text-darkText-300 transition-all duration-200"
        />
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 dark:text-darkText-500" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-3.5"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-darkText-500 hover:text-gray-600 dark:hover:text-darkText-300" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
