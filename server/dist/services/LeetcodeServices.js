"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platforms_1 = require("./platforms");
const EventRepository_1 = __importDefault(require("../repository/EventRepository"));
const contest_utils_1 = require("../utils/contest.utils"); // Import the utility function
const eventRepository = new EventRepository_1.default();
class LeetcodeServices {
    getLeetcodePastContests() {
        return __awaiter(this, void 0, void 0, function* () {
            const allContests = [];
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
                const response = yield fetch(platforms_1.leetcodeUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query }),
                });
                if (response.status !== 200) {
                    throw new Error("Failed to fetch contests from Leetcode API");
                }
                const data = yield response.json();
                if (data.errors) {
                    throw new Error("Failed to fetch contests from Leetcode API");
                }
                const contestData = data.data.pastContests.data.map((contest) => this.convertLeetcodeContestToSchemaData(contest));
                allContests.push(...contestData);
            }
            return allContests;
        });
    }
    getLeetcodeFutureContests() {
        return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch(platforms_1.leetcodeUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });
            if (response.status !== 200) {
                throw new Error("Failed to fetch contests from Leetcode API");
            }
            const data = yield response.json();
            if (data.errors) {
                throw new Error("Failed to fetch contests from Leetcode API");
            }
            const contestData = data.data.upcomingContests.map((contest) => this.convertLeetcodeContestToSchemaData(contest));
            return contestData;
        });
    }
    convertLeetcodeContestToSchemaData(contest) {
        try {
            const startTime = new Date(contest.startTime * 1000);
            const endTime = new Date(startTime.getTime() + 1.5 * 60 * 60 * 1000);
            const duration = (endTime.getTime() - startTime.getTime()) / 1000;
            return (0, contest_utils_1.generateContestSchemaDataFromApiData)({
                platform: "leetcode",
                contestId: contest.titleSlug,
                contestName: contest.title,
                contestStartDate: startTime,
                contestEndDate: endTime,
                contestDuration: duration,
                contestUrl: `https://leetcode.com/contest/${contest.titleSlug}`,
            });
        }
        catch (error) {
            console.error("Error converting Leetcode contest to schema data:", error);
            throw error;
        }
    }
    saveLeetcodeActiveContests() {
        return __awaiter(this, void 0, void 0, function* () {
            const contests = yield this.getLeetcodeFutureContests();
            if (contests && contests.length > 0) {
                const updatePromises = contests.map((contest) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const data = yield eventRepository.updateContest(contest);
                        return data;
                    }
                    catch (error) {
                        console.error("Error saving LeetCode active contest:", error);
                    }
                }));
                const results = yield Promise.all(updatePromises);
                console.log("Leetcode active contests updated successfully");
                return results;
            }
        });
    }
    saveLeetcodePastContests() {
        return __awaiter(this, void 0, void 0, function* () {
            const contests = yield this.getLeetcodePastContests();
            const updatePromises = contests.map((contest) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const data = yield eventRepository.updateContest(contest);
                    return data;
                }
                catch (error) {
                    console.error("Error saving LeetCode past contests:", error);
                }
            }));
            console.log("Leetcode past contests updated successfully");
            return yield Promise.all(updatePromises);
        });
    }
}
exports.default = LeetcodeServices;
