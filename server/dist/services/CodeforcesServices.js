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
const axios_1 = __importDefault(require("axios"));
const platforms_1 = require("./platforms");
const EventRepository_1 = __importDefault(require("../repository/EventRepository"));
const contest_utils_1 = require("../utils/contest.utils");
const eventRepository = new EventRepository_1.default();
class CodeforcesServices {
    getCodeforcesContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(platforms_1.codeforcesUrl);
                if (response.status === 200) {
                    const data = response.data.result;
                    const contestData = data.map((contest) => this.convertCodeforcesContestToSchemaData(contest));
                    return contestData;
                }
                else {
                    throw new Error("Failed to fetch contests from Codeforces API");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    convertCodeforcesContestToSchemaData(contest) {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const duration = contest.durationSeconds;
        const endTime = new Date(startTime.getTime() + duration * 1000);
        return (0, contest_utils_1.generateContestSchemaDataFromApiData)({
            platform: "codeforces",
            contestId: contest.type + contest.id.toString(),
            contestName: contest.name,
            contestStartDate: startTime,
            contestEndDate: endTime,
            contestDuration: duration,
            contestUrl: `https://codeforces.com/contest/${contest.id}`,
        });
    }
    saveCodeforcesContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contests = yield this.getCodeforcesContests();
                if (contests && contests.length > 0) {
                    yield Promise.all(contests.map((contest) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            const data = yield eventRepository.updateContest(contest);
                            return data;
                        }
                        catch (error) {
                            console.error("Error saving Codeforces contest:", error);
                        }
                    })));
                    console.log("Codeforces contests updated successfully");
                }
            }
            catch (error) {
                console.error("Error saving Codeforces contests:", error);
                throw error;
            }
        });
    }
}
exports.default = CodeforcesServices;
