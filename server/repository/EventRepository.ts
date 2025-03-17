import { Contest } from "../src/types/contest.types";
import ContestModel from "../models/ContestModel";

export default class EventRepository {
  async updateContest(contestData: Contest): Promise<any> {
    try {
      const existingContest = await ContestModel.findOne({
        contestId: contestData.contestId,
        platform: contestData.platform,
      });

      if (existingContest) {
        existingContest.contestName = contestData.contestName;
        existingContest.contestStartDate = contestData.contestStartDate;
        existingContest.contestEndDate = contestData.contestEndDate;
        existingContest.contestDuration = contestData.contestDuration;
        existingContest.contestUrl = contestData.contestUrl;

        if (contestData?.solutionVideoInfo)
          existingContest.solutionVideoInfo = contestData?.solutionVideoInfo;
        await existingContest.save();

        return existingContest;
      } else {
        const newContest = new ContestModel(contestData);
        await newContest.save();
        return newContest;
      }
    } catch (error) {
      console.error("Error updating/creating contest:", error);
      throw error;
    }
  }

  async getContestById(
    contestId: string,
    platform: string
  ): Promise<any | null> {
    try {
      const contest = await ContestModel.findOne({
        contestId: contestId,
        platform: platform,
      });
      return contest;
    } catch (error) {
      console.error("Error getting contest by ID:", error);
      throw error;
    }
  }

  async getContestByName(
    contestName: string,
    platform: string
  ): Promise<any | null> {
    try {
      let contest = await ContestModel.findOne({
        contestName: contestName,
        platform: platform,
      });

      if (!contest) {
        contest = await ContestModel.findOne({
          contestName: { $regex: new RegExp("^" + contestName + "$", "i") },
          platform: platform,
        });
      }

      if (!contest) {
        contest = await ContestModel.findOne({
          contestName: { $regex: new RegExp(contestName, "i") },
          platform: platform,
        });
      }

      if (!contest) {
        const allContests = await ContestModel.find({ platform: platform });

        contest =
          allContests.find((c) => {
            const normalizedContestName = c.contestName.toLowerCase();
            const normalizedSearchTerm = contestName.toLowerCase();

            return (
              normalizedContestName.includes(normalizedSearchTerm) ||
              normalizedSearchTerm.includes(normalizedContestName)
            );
          }) || null;
      }

      return contest;
    } catch (error) {
      console.error("Error getting contest by name:", error);
      throw error;
    }
  }

  async getAllContests(
    startDate?: string,
    endDate?: string
  ): Promise<Contest[] | null> {
    try {
      let query = {};
      // console.log(startDate, endDate);

      if (startDate && endDate) {
        query = {
          contestStartDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        };
      }

      const contests: Contest[] = await ContestModel.find(query)
        .sort({ contestStartDate: 1 })
        .select("-__v");
      return contests;
    } catch (error) {
      console.error("Error getting all contests:", error);
      throw error;
    }
  }

  async deleteContest(contestId: string, platform: string): Promise<void> {
    try {
      await ContestModel.deleteOne({
        contestId: contestId,
        platform: platform,
      });
    } catch (error) {
      console.error("Error deleting contest:", error);
      throw error;
    }
  }

  async deleteAllContests(): Promise<any> {
    try {
      await ContestModel.deleteMany();
      return "All contests deleted successfully";
    } catch (error) {
      console.error("Error deleting all contests:", error);
      throw error;
    }
  }

  async searchContests(
    query: string,
    platform?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    contests: any[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const searchFilter: any = {};

      searchFilter.$or = [
        { contestName: { $regex: new RegExp(query, "i") } },
        { contestId: { $regex: new RegExp(query, "i") } },
      ];

      if (platform) {
        searchFilter.platform = platform;
      }

      const skip = (page - 1) * limit;
      const total = await ContestModel.countDocuments(searchFilter);

      const contests = await ContestModel.find(searchFilter)
        .sort({ contestStartDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        contests,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error searching contests:", error);
      throw error;
    }
  }

  async getPaginatedContests(
    startDate?: string,
    endDate?: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<any[]> {
    try {
      let query: any = {};

      if (startDate && endDate) {
        query.contestStartDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        query.contestStartDate = { $gte: new Date(startDate) };
      } else if (endDate) {
        query.contestStartDate = { $lte: new Date(endDate) };
      }

      const contests = await ContestModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ contestStartDate: -1 });

      return contests;
    } catch (error) {
      console.error("Error getting paginated contests:", error);
      throw error;
    }
  }

  async getContestsCount(
    startDate?: string,
    endDate?: string
  ): Promise<number> {
    try {
      let query: any = {};

      if (startDate && endDate) {
        query.contestStartDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      } else if (startDate) {
        query.contestStartDate = { $gte: new Date(startDate) };
      } else if (endDate) {
        query.contestStartDate = { $lte: new Date(endDate) };
      }

      const count = await ContestModel.countDocuments(query);
      return count;
    } catch (error) {
      console.error("Error getting contests count:", error);
      throw error;
    }
  }

  async updateContestSolution(
    _id: string,
    solutionInfo: { title: string; url: string; thumbnail: string }
  ) {
    try {
      const updatedContest = await ContestModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: {
            solutionVideoInfo: solutionInfo,
          },
        },
        { new: true }
      );

      return updatedContest;
    } catch (error) {
      console.error("Error updating contest solution:", error);
      throw error;
    }
  }
}
