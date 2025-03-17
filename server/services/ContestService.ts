import LeetcodeServices from "./LeetcodeServices";
import CodechefServices from "./CodechefServices";
import CodeforcesServices from "./CodeforcesServices";
import ContestModel from "../models/ContestModel";

class ContestService {
  private leetcodeService: LeetcodeServices;
  private codechefService: CodechefServices;
  private codeforcesService: CodeforcesServices;

  constructor() {
    this.leetcodeService = new LeetcodeServices();
    this.codechefService = new CodechefServices();
    this.codeforcesService = new CodeforcesServices();
  }

  async getUpcomingContests() {
    try {
      const query = { contestStartDate: { $gte: new Date() } };
      // console.log("Query:", query);
      const allContests = await ContestModel.find(query).sort({
        contestStartDate: 1,
      });
      // console.log("Upcoming Contests:", allContests);
      return allContests;
    } catch (error) {
      console.error("Error fetching upcoming contests:", error);
      throw error;
    }
  }

  async updateAllContests() {
    try {
      await this.leetcodeService.saveLeetcodeActiveContests();
      await this.leetcodeService.saveLeetcodePastContests();
      await this.codechefService.saveCodechefActiveContests();
      await this.codechefService.saveCodechefPastContests();
      await this.codeforcesService.saveCodeforcesContests();

      console.log("All contests updated successfully.");
    } catch (error) {
      console.error("Error updating contests:", error);
    }
  }
}

export default new ContestService();
