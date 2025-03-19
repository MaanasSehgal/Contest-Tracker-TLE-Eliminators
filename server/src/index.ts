import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import LeetcodeServices from "../services/LeetcodeServices";
import CodechefServices from "../services/CodechefServices";
import CodeforcesServices from "../services/CodeforcesServices";
import EventRepository from "../repository/EventRepository";
import {
  getPCDVideos,
  getYouTubeVideoInfo,
  updateSolutionInfo,
} from "../utils/youtubeFetching.utils";
import contestService from "../services/ContestService";
import { updateAllContests, updateSolutions } from "../utils/utils";

dotenv.config();

const leetcodeService = new LeetcodeServices();
const codechefService = new CodechefServices();
const codeforcesService = new CodeforcesServices();
const eventRepository = new EventRepository();

mongoose.connect(process.env.MONGODB_URI || "");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const app = express();
const port = 8000;

const getIndianTime = () => {
  const indianTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
  });
  return indianTime;
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  console.log("/ route hit at time: ", getIndianTime());
  res.status(200).json({
    status: "success",
    message: "Server is on!",
  });
});

app.get("/leetcode", async (req, res) => {
  console.log("/leetcode route hit at time: ", getIndianTime());
  try {
    const contests = await leetcodeService.saveLeetcodePastContests();
    res.status(200).json({
      status: "success",
      data: contests,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Leetcode contests",
    });
  }
});

app.get("/codechef", async (req, res) => {
  console.log("/codechef route hit at time: ", getIndianTime());
  try {
    const contests = await codechefService.saveCodechefPastContests();
    res.status(200).json({
      status: "success",
      data: contests,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Codechef contests",
    });
  }
});

app.get("/codeforces", async (req, res) => {
  console.log("/codeforces route hit at time: ", getIndianTime());
  try {
    const contests = await codeforcesService.saveCodeforcesContests();
    res.status(200).json({
      status: "success",
      data: contests,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch Codeforces contests",
    });
  }
});

app.get("/contests", async (req, res) => {
  console.log("/contests route hit at time: ", getIndianTime());
  try {
    const { startDate, endDate, page, limit } = req.query;

    if (page || limit) {
      let pageNum = parseInt(page as string) || 1;
      let limitNum = parseInt(limit as string) || 10;

      pageNum = Math.max(1, pageNum);
      limitNum = Math.max(1, limitNum);

      const totalCount = await eventRepository.getContestsCount(
        startDate as string,
        endDate as string
      );

      if (limitNum >= totalCount) {
        const allContests = await eventRepository.getAllContests(
          startDate as string,
          endDate as string
        );

        res.status(200).json({
          status: "success",
          pagination: {
            total: totalCount,
            page: 1,
            limit: totalCount,
            totalPages: 1,
          },
          data: allContests,
        });
        return;
      }

      const skip = (pageNum - 1) * limitNum;

      if (skip >= totalCount) {
        res.status(200).json({
          status: "success",
          data: [],
          pagination: {
            total: totalCount,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(totalCount / limitNum),
          },
        });
        return;
      }

      const contests = await eventRepository.getPaginatedContests(
        startDate as string,
        endDate as string,
        skip,
        limitNum
      );

      res.status(200).json({
        status: "success",
        data: contests,
        pagination: {
          total: totalCount,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(totalCount / limitNum),
        },
      });
      return;
    }

    const contests = await eventRepository.getAllContests(
      startDate as string,
      endDate as string
    );

    res.status(200).json({
      status: "success",
      data: contests,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.get("/search-contests", async (req, res) => {
  console.log("/search-contests route hit at time: ", getIndianTime());
  try {
    const { query, platform, page, limit } = req.query;

    if (!query) {
      res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
      return;
    }

    const searchQuery = query as string;
    const platformFilter = platform as string | undefined;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const searchResults = await eventRepository.searchContests(
      searchQuery,
      platformFilter,
      pageNum,
      limitNum
    );

    res.status(200).json({
      status: "success",
      data: searchResults,
    });
  } catch (error) {
    console.error("Error searching contests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to search contests",
    });
  }
});

app.get("/upcoming-contests", async (req, res) => {
  console.log(
    "/upcoming-contests route hit at time: ",
    getIndianTime()
  );
  try {
    const contests = await contestService.getUpcomingContests();
    res.status(200).json({
      status: "success",
      data: contests,
    });
  } catch (error) {
    console.error("Error fetching upcoming contests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch upcoming contests",
    });
  }
});

app.get("/update-all-contests", async (req, res) => {
  console.log(
    "/update-all-contests route hit at time: ",
    getIndianTime()
  );
  try {
    await contestService.updateAllContests();
    res.status(200).json({
      status: "success",
      message: "All contests updated successfully",
    });
  } catch (error) {
    console.error("Error updating all contests:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update contests",
    });
  }
});

app.get("/delete", async (req, res) => {
  console.log("/delete route hit at time: ", getIndianTime());
  const { contestId } = req.query;
  try {
    const result = await eventRepository.deleteAllContests();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to delete contests",
    });
  }
});

app.get("/update-solution-links", async (req, res) => {
  console.log(
    "/update-solution-links route hit at time: ",
    getIndianTime()
  );
  try {
    await updateSolutionInfo();
    res.status(200).json({
      status: "success",
      message: "Solution links updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.get("/get-pcd-videos", async (req, res) => {
  console.log("/get-pcd-videos route hit at time: ", getIndianTime());
  try {
    const videos = await getPCDVideos();
    res.status(200).json({
      status: "success",
      data: videos,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

app.post("/update-contest-solution", async (req, res) => {
  console.log(
    "/update-contest-solution route hit at time: ",
    getIndianTime()
  );
  try {
    const { contestId, youtubeUrl } = req.body;

    if (!contestId || !youtubeUrl) {
      res.status(400).json({
        status: "error",
        message:
          "Missing required parameters. Please provide contestId and youtubeUrl.",
      });
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(youtubeUrl)) {
      res.status(400).json({
        status: "error",
        message: "Invalid YouTube URL format",
      });
      return;
    }

    // Get video information from YouTube
    const videoInfo = await getYouTubeVideoInfo(youtubeUrl);
    if (!videoInfo) {
      res.status(404).json({
        status: "error",
        message: "Could not retrieve video information from YouTube",
      });
      return;
    }

    const newSolution = {
      title: videoInfo?.title || "",
      url: youtubeUrl || "",
      thumbnail: videoInfo?.thumbnail || "",
    };

    const updatedContest = await eventRepository.updateContestSolution(
      contestId,
      newSolution
    );

    if (!updatedContest) {
      res.status(404).json({
        status: "error",
        message: "Contest not found with the provided ID",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Contest solution video updated successfully",
      data: updatedContest,
    });
  } catch (error) {
    console.error("Error updating contest solution:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to update contest solution",
    });
  }
});

app.get("/trigger-update-all-contests", async (req, res) => {
  console.log(
    "/trigger-update-all-contests route hit at time: ",
    getIndianTime()
  );
  try {
    await updateAllContests();
    res.status(200).json({
      status: "success",
      message: "Updated all contests successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update contests",
    });
  }
});

//Manually trigger update all solution links and link it to contest tracker
app.get("/trigger-update-solutions", async (req, res) => {
  console.log(
    "/trigger-update-solutions route hit at time: ",
    getIndianTime()
  );
  try {
    await updateSolutions();
    res.status(200).json({
      status: "success",
      message: "Updated all solution links successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update solution links",
    });
  }
});

app.get("/trigger-all", async (req, res) => {
  console.log("/trigger-all route hit at time: ", getIndianTime());
  try {
    await updateAllContests();
    await updateSolutions();
    res.status(200).json({
      status: "success",
      message: "Updated all contests and solution links successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update contests and solutions",
    });
  }
});

// Every 12hr update all contests and update solution links
cron.schedule("0 0,12 * * *", async () => {
  console.log("Running cron job at time: ", getIndianTime());
  try {
    await updateAllContests();
    console.log("All contests updated successfully.");

    await updateSolutions();
    console.log("Solution links updated successfully.");
  } catch (error) {
    console.error("Error during scheduled task:", error);
  }
});


// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
