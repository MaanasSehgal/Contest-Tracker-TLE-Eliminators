import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CheckCircle2, SlidersHorizontal } from "lucide-react";

import ContestCard from "../components/update-contest/ContestCard";
import SolutionModal from "../components/update-contest/SolutionModal";
import SearchFilters from "../components/update-contest/SearchFilter";
import EmptyState from "../components/update-contest/EmptyState";
import LoadingState from "../components/update-contest/LoadingState";
import Pagination from "../components/update-contest/Pagination";
import { ContestSchema } from "../types/contestTypes";

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const UpdateContest: React.FC = () => {
  const [contests, setContests] = useState<ContestSchema[]>([]);
  const [selectedContest, setSelectedContest] = useState<ContestSchema | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || "";

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      setIsSearchMode(true);
      searchContests();
    } else {
      setIsSearchMode(false);
      fetchContests();
    }
  }, [pagination.page, searchTerm]);

  const fetchContests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/contests`, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      if (response.data.status === "success") {
        let filteredContests =
          response.data.data.contests || response.data.data;
        setContests(filteredContests);

        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch contests");
      console.error("Error fetching contests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchContests = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/search-contests`, {
        params: {
          query: searchTerm,
          page: pagination.page,
          limit: pagination.limit,
        },
      });

      if (response.data.status === "success") {
        let searchResults = response.data.data.contests || response.data.data;
        setContests(searchResults);

        if (response.data.data.pagination) {
          setPagination(response.data.data.pagination);
        }
      }
    } catch (error) {
      toast.error("Failed to search contests");
      console.error("Error searching contests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSuccess = (updatedContest: ContestSchema) => {
    console.log("Updated contest:", updatedContest);
    console.log(contests);
    setContests((prevContests) =>
      prevContests.map((contest) =>
        contest._id === updatedContest._id ? updatedContest : contest
      )
    );

    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);

    setIsModalOpen(false);
    setSelectedContest(null);
  };

  const openSolutionModal = (contest: ContestSchema) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 md:py-12 max-w-7xl"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-darkText-300">
          Contest Solutions
        </h1>
        <p className="text-gray-600 dark:text-darkText-400">
          Add or update YouTube solution videos for coding contests
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-6"
      >
        <div className="bg-white dark:bg-darkBox-900 rounded-xl shadow-md p-4 md:p-6 border border-gray-100 dark:border-darkBorder-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-darkText-300 flex items-center">
              <Search className="w-5 h-5 mr-2 text-primary" />
              Find Contests
            </h2>
          </div>

          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white dark:bg-darkBox-900 rounded-xl shadow-md border border-gray-100 dark:border-darkBorder-800 overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-darkBorder-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-darkText-300">
            {isSearchMode ? "Search Results" : "All Contests"}
          </h2>
          <div className="flex items-center gap-3">
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full">
              {pagination.total} contests
            </span>
            {isSearchMode && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsSearchMode(false);
                }}
                className="text-sm text-gray-600 dark:text-darkText-400 hover:text-primary dark:hover:text-purple-400 flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Clear search
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <LoadingState />
        ) : contests.length === 0 ? (
          <EmptyState isSearchMode={isSearchMode} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:p-6">
            {contests.map((contest) => (
              <ContestCard
                key={contest._id}
                contest={contest}
                onAddSolution={() => openSolutionModal(contest)}
              />
            ))}
          </div>
        )}

        {!isLoading && contests.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && selectedContest && (
          <SolutionModal
            contest={selectedContest}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedContest(null);
            }}
            onSuccess={handleUpdateSuccess}
            backendUrl={backendUrl}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UpdateContest;
