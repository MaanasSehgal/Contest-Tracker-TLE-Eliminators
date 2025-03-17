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
class CodechefServices {
    getCodechefPastContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(platforms_1.codechefUrl);
                const data = response.data;
                if (data.status === "success") {
                    const data = response.data.past_contests;
                    const contestData = data.map((contest) => this.convertCodechefContestToSchemaData(contest));
                    return contestData;
                }
                else {
                    throw new Error("Failed to fetch contests from Codechef API");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    getCodechefFutureContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(platforms_1.codechefUrl);
                if (response.data.status === "success") {
                    const data = response.data.future_contests;
                    const contestData = data.map((contest) => this.convertCodechefContestToSchemaData(contest));
                    return contestData;
                }
                else {
                    throw new Error("Failed to fetch contests from Codechef API");
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    convertCodechefContestToSchemaData(contest) {
        const startTime = new Date(contest.contest_start_date);
        const endTime = new Date(contest.contest_end_date);
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;
        return (0, contest_utils_1.generateContestSchemaDataFromApiData)({
            platform: 'codechef',
            contestId: contest.contest_code,
            contestName: contest.contest_name,
            contestStartDate: startTime,
            contestEndDate: endTime,
            contestDuration: duration,
            contestUrl: `https://www.codechef.com/${contest.contest_code}`,
        });
    }
    saveCodechefActiveContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const futureContests = yield this.getCodechefFutureContests();
                if (futureContests && futureContests.length > 0) {
                    console.log("Codechef active contests updated successfully");
                    return yield Promise.all(futureContests.map((contest) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield eventRepository.updateContest(contest);
                        return data;
                    })));
                }
            }
            catch (error) {
                console.error("Error saving Codechef active contest:", error);
                throw error;
            }
        });
    }
    saveCodechefPastContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const futureContests = yield this.getCodechefPastContests();
                if (futureContests && futureContests.length > 0) {
                    console.log("Codechef past contests updated successfully");
                    return yield Promise.all(futureContests.map((contest) => __awaiter(this, void 0, void 0, function* () {
                        const data = yield eventRepository.updateContest(contest);
                        return data;
                    })));
                }
            }
            catch (error) {
                console.error("Error saving Codechef past contest:", error);
                throw error;
            }
        });
    }
}
exports.default = CodechefServices;
