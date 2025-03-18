import ContestService from "../services/ContestService";
import { updateSolutionInfo } from "./youtubeFetching.utils";

export const updateSolutions = async () => {
  console.log("Running solution link update task");
  try {
    await updateSolutionInfo();
    console.log("Scheduled solution link update completed successfully");
  } catch (error) {
    console.error("Error in scheduled solution link update:", error);
  }
};

export const updateAllContests = async () => {
    console.log("Running scheduled task: Updating all contests");
    try {
      await ContestService.updateAllContests();
      console.log("Scheduled contest update completed successfully");
    } catch (error) {
      console.error("Error in scheduled contest update:", error);
    }
  };
  