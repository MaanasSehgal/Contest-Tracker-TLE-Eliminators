import React from "react";
import { getPlatformIcon } from "../../utils/helper";
import { TabButtonProps } from "../../types/types";

const TabButton: React.FC<TabButtonProps> = ({
  platform,
  label,
  activeTab,
  setActiveTab,
  currentTheme,
}) => (
  <button
    onClick={() => setActiveTab(platform)}
    className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 rounded-md transition-all duration-200 ${
      activeTab === platform
        ? "bg-primary text-white shadow-md"
        : "bg-gray-100 dark:bg-darkBox-800 text-gray-700 dark:text-darkText-300 hover:bg-gray-200 dark:hover:bg-darkBox-700"
    }`}
  >
    <div className="w-5 h-5">
      <img
        src={getPlatformIcon(platform, currentTheme)}
        alt={platform}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
    <span className="text-sm md:text-base">{label}</span>
  </button>
);

export default TabButton;
