import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import useStore from "../zustand/useStore.store";
import VideoCard from "../components/post-contest-discussions/VideoCard";
import TabButton from "../components/post-contest-discussions/TabButton";
import SearchBar from "../components/post-contest-discussions/SearchBar";
import {
  containerVariants,
  PlatformType,
  Video,
  VideosData,
} from "../types/types";

const PostContestDiscussions: React.FC = () => {
  const currentTheme = useStore((state) => state.currentTheme);
  const [videosData, setVideosData] = useState<VideosData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PlatformType>("leetcode");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/get-pcd-videos`
        );
        if (response.data.status === "success") {
          setVideosData(response.data.data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (!videosData) return;

    let videos: Video[] = [];

    switch (activeTab) {
      case "leetcode":
        videos = videosData.leetcodeVideos || [];
        break;
      case "codeforces":
        videos = videosData.codeforcesVideos || [];
        break;
      case "codechef":
        videos = videosData.codechefVideos || [];
        break;
    }

    if (searchQuery) {
      videos = videos.filter(
        (video) =>
          video.snippet.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          video.snippet.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVideos(videos);
  }, [videosData, activeTab, searchQuery]);

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (filteredVideos.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-darkText-400">
            {searchQuery
              ? `No videos found matching "${searchQuery}"`
              : "No videos available for this platform"}
          </p>
        </div>
      );
    }

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            activeTab={activeTab}
            currentTheme={currentTheme}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300 py-6 md:py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-darkText-300 mb-3 md:mb-4">
            Post Contest Discussions
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-darkText-400 max-w-2xl mx-auto">
            Watch video solutions and discussions from TLE Eliminators for
            recent competitive programming contests across different platforms.
          </p>
        </motion.div>

        {/* Search Bar */}
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="mb-6 md:mb-8">
          <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            <TabButton
              platform="leetcode"
              label="LeetCode"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentTheme={currentTheme}
            />
            <TabButton
              platform="codeforces"
              label="Codeforces"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentTheme={currentTheme}
            />
            <TabButton
              platform="codechef"
              label="CodeChef"
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentTheme={currentTheme}
            />
          </div>
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default PostContestDiscussions;
