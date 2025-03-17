import React from "react";
import { motion } from "framer-motion";
import { Youtube, ExternalLink, Calendar, Clock, User } from "lucide-react";
import { getPlatformIcon } from "../../utils/helper";
import { itemVariants, PlatformType, Video } from "../../types/types";

interface VideoCardProps {
  video: Video;
  activeTab: PlatformType;
  currentTheme: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  activeTab,
  currentTheme,
}) => {
  const { snippet } = video;
  const videoUrl = `https://www.youtube.com/watch?v=${snippet.resourceId.videoId}`;
  const thumbnailUrl =
    snippet.thumbnails.high?.url ||
    snippet.thumbnails.medium?.url ||
    snippet.thumbnails.default?.url;
  const publishDate = formatDate(snippet.publishedAt);
  const timestamps = extractTimestamps(snippet.description);

  return (
    <motion.div
      key={video.id}
      variants={itemVariants}
      className="bg-white dark:bg-darkBox-900 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-darkBorder-800 transition-colors duration-300 flex flex-col h-full"
    >
      <div className="relative group">
        <img
          src={thumbnailUrl}
          alt={snippet.title}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primaryHover text-white font-medium py-2 px-4 rounded-full flex items-center space-x-2 transition-colors duration-200"
          >
            <Youtube size={18} />
            <span>Watch Video</span>
          </a>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-3">
          <div className="w-6 h-6 mr-2">
            <img
              src={getPlatformIcon(activeTab, currentTheme)}
              alt={activeTab}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-darkText-400 capitalize">
            {activeTab}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText-300 line-clamp-2 mb-2">
          {snippet.title}
        </h3>

        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-darkText-400 mb-3">
          <Calendar
            size={16}
            className="text-primary dark:text-purple-500 flex-shrink-0"
          />
          <span className="truncate">{publishDate}</span>
          <span className="mx-1 flex-shrink-0">•</span>
          <User
            size={16}
            className="text-primary dark:text-purple-500 flex-shrink-0"
          />
          <span className="truncate">{snippet.videoOwnerChannelTitle}</span>
        </div>

        {timestamps.length > 0 && (
          <div className="mt-auto">
            <h4 className="text-sm font-medium text-gray-700 dark:text-darkText-300 mb-2 flex items-center">
              <Clock
                size={16}
                className="mr-2 text-primary dark:text-purple-500"
              />
              Timestamps
            </h4>
            <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-darkBox-700 pr-2">
              {timestamps.slice(0, 4).map((ts, idx) => (
                <a
                  key={idx}
                  href={`${videoUrl}&t=${ts.time
                    .split(":")
                    .reduce(
                      (acc: number, time: string) => 60 * acc + +time,
                      0
                    )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs py-1 text-gray-600 dark:text-darkText-400 hover:text-primary dark:hover:text-purple-500 transition-colors duration-200"
                >
                  <span className="inline-block w-12 font-mono text-primary dark:text-purple-500">
                    {ts.time}
                  </span>
                  <span className="line-clamp-1">{ts.title}</span>
                </a>
              ))}
              {timestamps.length > 4 && (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary dark:text-purple-500 hover:underline mt-1 inline-flex items-center"
                >
                  <span>View all timestamps</span>
                  <ExternalLink size={12} className="ml-1" />
                </a>
              )}
            </div>
          </div>
        )}

        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 text-primary dark:text-purple-500 text-sm font-medium hover:underline inline-flex items-center"
        >
          <span>Watch on YouTube</span>
          <ExternalLink size={14} className="ml-1" />
        </a>
      </div>
    </motion.div>
  );
};

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const extractTimestamps = (description: string) => {
  const timestampRegex = /(\d+:\d+(?::\d+)?)\s*(.*?)(?=\n\d+:\d+|$)/g;
  const matches = [...description.matchAll(timestampRegex)];

  return matches.map((match) => ({
    time: match[1],
    title: match[2].trim(),
  }));
};

export default VideoCard;
