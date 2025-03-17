import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Youtube } from "lucide-react";
import { formatTime, getFormattedTimeStamp } from "../../utils/helper";
import { platformIconMap, platformDarkIconMap } from "../../data/PlatformIconmap";
import useStore from "../../zustand/useStore.store";
import { ContestSchema } from "../../types/contestTypes";

interface ContestCardProps {
  contest: ContestSchema;
  onAddSolution: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, onAddSolution }) => {
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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-darkBox-850 rounded-xl shadow-sm border border-gray-100 dark:border-darkBorder-800 overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="w-5 h-5 mr-2 overflow-hidden">
              <img
                src={getPlatformIcon(contest.platform) || "/notfound.jpg"}
                alt={contest.platform}
                className="w-full h-full object-contain"
              />
            </div>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPlatformColor(contest.platform)}`}>
              {contest.platform}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-darkText-500">
            ID: {contest.contestId}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText-300 mb-2 truncate whitespace-nowrap">
          {contest.contestName}
        </h3>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="text-sm text-gray-700 dark:text-darkText-400 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
            {getFormattedTimeStamp(new Date(contest.contestStartDate))}
          </div>
          <div className="text-xs text-gray-500 dark:text-darkText-500 flex items-center">
            <Clock className="w-3 h-3 mr-1.5 text-gray-400 dark:text-darkText-500" />
            {formatTime(new Date(contest.contestStartDate))} - {formatTime(new Date(contest.contestEndDate))}
          </div>
        </div>
        
        {contest.solutionVideoInfo ? (
          <div className="flex items-center h-14 mb-4 p-2 bg-gray-50 dark:bg-darkBox-900 rounded-lg">
            <div className="w-10 h-10 rounded overflow-hidden mr-2 flex-shrink-0 bg-gray-100 dark:bg-darkBox-800">
              {contest.solutionVideoInfo.thumbnail ? (
                <img
                  src={contest.solutionVideoInfo.thumbnail}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <a
                href={contest.solutionVideoInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primaryHover dark:text-purple-400 dark:hover:text-purple-300 flex items-center"
              >
                <span className="truncate">
                  {contest.solutionVideoInfo.title || "View Solution"}
                </span>
                <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
              </a>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-14 mb-4 p-2 bg-gray-50 dark:bg-darkBox-900 rounded-lg">
            <span className="text-xs text-gray-500 dark:text-darkText-500">
              No solution available yet
            </span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onAddSolution}
            className="flex-1 px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primaryHover transition-colors duration-200 flex items-center justify-center"
          >
            <Youtube className="w-3.5 h-3.5 mr-1.5" />
            {contest.solutionVideoInfo ? "Update" : "Add Solution"}
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={contest.contestUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 dark:bg-darkBox-800 dark:text-darkText-300 dark:hover:bg-darkBox-700 transition-colors duration-200 flex items-center justify-center"
          >
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Visit
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

export default ContestCard;
