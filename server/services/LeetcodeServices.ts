import { leetcodeUrl } from "./platforms";
import EventRepositiory from "../repository/EventRepository";
import { generateContestSchemaDataFromApiData } from "../utils/contest.utils"; // Import the utility function
import { Contest } from "../src/types/contest.types";

const eventRepository = new EventRepositiory();

interface LeetcodeContestApiResponse {
  title: string;
  titleSlug: string;
  startTime: number;
  originStartTime: number;
  cardImg: string | null;
  sponsors: any[];
}

export default class LeetcodeServices {
  async getLeetcodePastContests(): Promise<Contest[]> {
    const allContests: Contest[] = [];
    for (let pageNo = 1; pageNo <= 10; pageNo++) {
      const query = `
      {
        pastContests(pageNo: ${pageNo}, numPerPage: 30) {
          pageNum
          currentPage
          totalNum
          numPerPage
          data {
            title
            titleSlug
            startTime
            originStartTime
            cardImg
            sponsors {
              name
              logo
            }
          }
        }
      }`;

      const response = await fetch(leetcodeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch contests from Leetcode API");
      }
      const data = await response.json();

      if (data.errors) {
        throw new Error("Failed to fetch contests from Leetcode API");
      }

      const contestData: Contest[] = data.data.pastContests.data.map(
        (contest: any) => this.convertLeetcodeContestToSchemaData(contest)
      );

      allContests.push(...contestData);
    }

    return allContests;
  }

  async getLeetcodeFutureContests(): Promise<Contest[]> {
    const query = `
    {
      upcomingContests {
        title
        titleSlug
        startTime
        originStartTime
        cardImg
        sponsors {
          name
          logo
        }
      }
    }`;

    const response = await fetch(leetcodeUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch contests from Leetcode API");
    }
    const data = await response.json();
    if (data.errors) {
      throw new Error("Failed to fetch contests from Leetcode API");
    }

    const contestData: Contest[] = data.data.upcomingContests.map(
      (contest: any) => this.convertLeetcodeContestToSchemaData(contest)
    );
    return contestData;
  }

  private convertLeetcodeContestToSchemaData(
    contest: LeetcodeContestApiResponse
  ): Contest {
    try {
      const startTime = new Date(contest.startTime * 1000);
      const endTime = new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000);
      const duration = (endTime.getTime() - startTime.getTime()) / 1000;

      return generateContestSchemaDataFromApiData({
        platform: "leetcode",
        contestId: contest.titleSlug,
        contestName: contest.title,
        contestStartDate: startTime,
        contestEndDate: endTime,
        contestDuration: duration,
        contestUrl: `https://leetcode.com/contest/${contest.titleSlug}`,
      });
    } catch (error) {
      console.error("Error converting Leetcode contest to schema data:", error);
      throw error;
    }
  }

  async saveLeetcodeActiveContests(): Promise<any> {
    const contests = await this.getLeetcodeFutureContests();
    if (contests && contests.length > 0) {
      const updatePromises = contests.map(async (contest) => {
        try {
          const data = await eventRepository.updateContest(contest);
          return data;
        } catch (error) {
          console.error("Error saving LeetCode active contest:", error);
        }
      });
      const results = await Promise.all(updatePromises);
      console.log("Leetcode active contests updated successfully");
      return results;
    }
  }

  async saveLeetcodePastContests(): Promise<any> {
    const contests = await this.getLeetcodePastContests();
    const updatePromises = contests.map(async (contest) => {
      try {
        const data = await eventRepository.updateContest(contest);
        return data;
      } catch (error) {
        console.error("Error saving LeetCode past contests:", error);
      }
    });
    console.log("Leetcode past contests updated successfully");
    return await Promise.all(updatePromises);
  }
}
