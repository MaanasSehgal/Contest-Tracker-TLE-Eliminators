export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    default: VideoThumbnail;
    medium: VideoThumbnail;
    high: VideoThumbnail;
    standard: VideoThumbnail;
    maxres: VideoThumbnail;
  };
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: {
    kind: string;
    videoId: string;
  };
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

export interface Video {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
}

export interface VideosData {
  leetcodeVideos: Video[];
  codeforcesVideos: Video[];
  codechefVideos: Video[];
}

export type PlatformType = "leetcode" | "codeforces" | "codechef";

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const itemVariants = {
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

export interface TabButtonProps {
  platform: PlatformType;
  label: string;
  activeTab: PlatformType;
  setActiveTab: (platform: PlatformType) => void;
  currentTheme: string;
}
