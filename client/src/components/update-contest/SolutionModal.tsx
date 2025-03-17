import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import axios from "axios";
import { X, Youtube, Loader2, Calendar } from "lucide-react";
import { getFormattedTimeStamp } from "../../utils/helper";
import { platformIconMap, platformDarkIconMap } from "../../data/PlatformIconmap";
import { platformNames } from "../../data/data";
import useStore from "../../zustand/useStore.store";
import { ContestSchema } from "../../types/contestTypes";

interface SolutionModalProps {
  contest: ContestSchema;
  onClose: () => void;
  onSuccess: (updatedContest: ContestSchema) => void;
  backendUrl: string;
}

const SolutionModal: React.FC<SolutionModalProps> = ({
  contest,
  onClose,
  onSuccess,
  backendUrl,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState(contest.solutionVideoInfo?.url || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentTheme = useStore((state) => state.currentTheme);

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "codeforces":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "leetcode":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "codechef":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    }
  };
  
  const getPlatformIcon = (platform: string) => {
    const platformKey = platform.toLowerCase();
    return currentTheme === 'dark' 
      ? platformDarkIconMap.get(platformKey) 
      : platformIconMap.get(platformKey);
  };

  const getPlatformDisplayName = (platform: string) => {
    return platformNames.get(platform.toLowerCase()) || platform;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!youtubeUrl) {
      toast.error("Please enter a YouTube URL");
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      toast.error("Invalid YouTube URL format");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/update-contest-solution`,
        {
          contestId: contest._id,
          youtubeUrl,
        }
      );

      if (response.data.status === "success") {
        onSuccess(response.data.data.contest);
      }
      toast.success("Contest solution updated successfully");
    } catch (error: any) {
      toast.error(
        error.response?.message || "Failed to update contest solution"
      );
      console.error("Error updating contest solution:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-darkBox-900 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-darkBorder-800">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-darkText-300">
            {contest.solutionVideoInfo ? "Update Solution" : "Add Solution"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-darkText-400 dark:hover:text-darkText-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="mb-5 p-4 bg-gray-50 dark:bg-darkBox-850 rounded-lg border border-gray-100 dark:border-darkBorder-800">
            <h4 className="font-medium text-gray-800 dark:text-darkText-300 mb-2">
              {contest.contestName}
            </h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex items-center">
                <div className="w-5 h-5 mr-1 overflow-hidden">
                  <img
                    src={getPlatformIcon(contest.platform) || "/notfound.jpg"}
                    alt={contest.platform}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getPlatformColor(contest.platform)}`}>
                  {getPlatformDisplayName(contest.platform)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-darkText-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {getFormattedTimeStamp(new Date(contest.contestStartDate))}
              </span>
            </div>
            {contest.solutionVideoInfo && (
              <div className="text-xs text-gray-500 dark:text-darkText-500 mt-2">
                Current solution: {contest.solutionVideoInfo.title || contest.solutionVideoInfo.url}
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label
                htmlFor="youtubeUrl"
                className="block text-sm font-medium text-gray-700 dark:text-darkText-300 mb-2"
              >
                YouTube Solution URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-grow p-3 border border-gray-200 dark:border-darkBorder-700 rounded-l-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkBox-850 dark:text-darkText-300 transition-all duration-200"
                  disabled={isSubmitting}
                />
                <div className="bg-primary p-3 rounded-r-lg">
                  <Youtube className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-darkText-500">
                Enter a valid YouTube video URL that contains the solution for this contest
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-darkBox-850 dark:text-darkText-300 dark:hover:bg-darkBox-700 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primaryHover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Solution"
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SolutionModal;
