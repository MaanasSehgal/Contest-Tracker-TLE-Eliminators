import { google } from "googleapis";
import EventRepository from "../repository/EventRepository";
require("dotenv").config();

const eventRepository = new EventRepository();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  console.error("Error: YOUTUBE_API_KEY environment variable not set.");
  process.exit(1);
}

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});

async function fetchPlaylistItems(playlistId: string): Promise<any[]> {
  try {
    const response = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistId,
      maxResults: 50,
    });
    return response.data.items as any[];
  } catch (error) {
    console.error("Error fetching playlist items:", error);
    return [];
  }
}

function normalizeContestName(name: string): string {
  let normalized = name.replace(/\s+/g, " ").trim();

  normalized = normalized.replace(
    /Div\s*(\d+)\s*\+\s*(\d+)/g,
    "Div. $1 + Div. $2"
  );

  normalized = normalized.replace(/Div\s+(\d+)/g, "Div. $1");

  if (normalized.includes("Educational") && !normalized.includes("Rated")) {
    normalized = normalized.replace(
      /(Educational Codeforces Round \d+)/,
      "$1 (Rated for Div. 2)"
    );
  }

  return normalized;
}

export async function getPCDVideos() {
  try {
    const leetcodePlaylistId = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";
    const codeforcesPlaylistId = "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB";
    const codechefPlaylistId = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

    const leetcodeVideos = await fetchPlaylistItems(leetcodePlaylistId);
    const codeforcesVideos = await fetchPlaylistItems(codeforcesPlaylistId);
    const codechefVideos = await fetchPlaylistItems(codechefPlaylistId);

    return {
      leetcodeVideos,
      codeforcesVideos,
      codechefVideos,
    };
  } catch (error) {
    console.error("Error fetching PCD videos:", error);
    return {
      leetcodeVideos: [],
      codeforcesVideos: [],
      codechefVideos: [],
    };
  }
}

export async function updateSolutionInfo() {
  const leetcodePlaylistId = "PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr";
  const codeforcesPlaylistId = "PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB";
  const codechefPlaylistId = "PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr";

  const leetcodeVideos = await fetchPlaylistItems(leetcodePlaylistId);
  const codeforcesVideos = await fetchPlaylistItems(codeforcesPlaylistId);
  const codechefVideos = await fetchPlaylistItems(codechefPlaylistId);

  let successCount = 0;
  let failureCount = 0;

  console.log("Processing LeetCode videos...");
  for (const video of leetcodeVideos) {
    try {
      const videoTitle = video.snippet.title;
      const platform = "leetcode";

      let contestIdMatch =
        videoTitle.match(/Weekly Contest (\d+)/) ||
        videoTitle.match(/Biweekly Contest (\d+)/);
      let contestId = contestIdMatch ? contestIdMatch[0] : null;

      if (contestId) {
        const contestNumber = contestIdMatch[1];
        const contestType = videoTitle.includes("Biweekly")
          ? "biweekly"
          : "weekly";
        const formattedContestId = `${contestType}-contest-${contestNumber}`;

        const url = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
        const contest = await eventRepository.getContestById(
          formattedContestId,
          platform
        );

        if (contest) {
          contest.solutionVideoInfo = {
            title: videoTitle,
            url: url,
            thumbnail: video.snippet.thumbnails.medium.url,
          };

          await eventRepository.updateContest(contest);
          console.log(
            `✅ Updated solution for ${platform} ${formattedContestId}`
          );
          successCount++;
        } else {
          console.log(
            `❌ Contest not found for ${platform} ${formattedContestId}`
          );
          failureCount++;
        }
      }
    } catch (error) {
      console.error("Error processing LeetCode video:", error);
      failureCount++;
    }
  }

  console.log("\nProcessing Codeforces videos...");
  for (const video of codeforcesVideos) {
    try {
      const videoTitle = video.snippet.title;
      const platform = "codeforces";

      // Extract the contest name before the first pipe symbol
      const separatorIndex = videoTitle.indexOf("|");
      const baseContestName =
        separatorIndex !== -1
          ? videoTitle.substring(0, separatorIndex).trim()
          : videoTitle.trim();

      const normalizedContestName = normalizeContestName(baseContestName);

      const url = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;
      const contest = await eventRepository.getContestByName(
        normalizedContestName,
        platform
      );

      if (contest) {
        contest.solutionVideoInfo = {
          title: videoTitle,
          url: url,
          thumbnail: video.snippet.thumbnails.medium.url,
        };

        await eventRepository.updateContest(contest);
        console.log(
          `✅ Updated solution for ${platform} "${normalizedContestName}"`
        );
        successCount++;
      } else {
        console.log(
          `❌ Contest not found for ${platform} "${normalizedContestName}"`
        );
        failureCount++;
      }
    } catch (error) {
      console.error("Error processing Codeforces video:", error);
      failureCount++;
    }
  }

  console.log("\nProcessing CodeChef videos...");
  for (const video of codechefVideos) {
    try {
      const videoTitle = video.snippet.title;
      const platform = "codechef";

      const contestIdMatch = videoTitle.match(
        /Codechef Starters (\d+)(?:\s*\(Div\s*(\d+)\))?/i
      );

      if (contestIdMatch) {
        const starterNumber = contestIdMatch[1];
        const formattedContestId = `START${starterNumber}`;
        const url = `https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`;

        const contest = await eventRepository.getContestById(
          formattedContestId,
          platform
        );

        if (contest) {
          contest.solutionVideoInfo = {
            title: videoTitle,
            url: url,
            thumbnail: video.snippet.thumbnails.medium.url,
          };

          await eventRepository.updateContest(contest);
          console.log(
            `✅ Updated solution for ${platform} ${formattedContestId}`
          );
          successCount++;
        } else {
          console.log(
            `❌ Contest not found for ${platform} ${formattedContestId}`
          );
          failureCount++;
        }
      } else {
        console.log(
          `❓ Could not parse contest ID from title: "${videoTitle}"`
        );
        failureCount++;
      }
    } catch (error) {
      console.error("Error processing CodeChef video:", error);
      failureCount++;
    }
  }

  console.log("\n=== Summary ===");
  console.log(`✅ Successfully updated: ${successCount} contests`);
  console.log(`❌ Failed to update: ${failureCount} contests`);
}

export function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Gets video information from a YouTube URL
export async function getYouTubeVideoInfo(url: string) {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      throw new Error("YouTube API key is not configured");
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`
    );

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw new Error("Video not found");
    }

    const videoDetails = data.items[0].snippet;

    return {
      title: videoDetails.title,
      thumbnail:
        videoDetails.thumbnails.high.url || videoDetails.thumbnails.default.url,
    };
  } catch (error) {
    console.error("Error fetching YouTube video info:", error);
    return null;
  }
}
