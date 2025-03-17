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
const ContestModel_1 = __importDefault(require("../models/ContestModel"));
class EventRepository {
    updateContest(contestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingContest = yield ContestModel_1.default.findOne({
                    contestId: contestData.contestId,
                    platform: contestData.platform,
                });
                if (existingContest) {
                    existingContest.contestName = contestData.contestName;
                    existingContest.contestStartDate = contestData.contestStartDate;
                    existingContest.contestEndDate = contestData.contestEndDate;
                    existingContest.contestDuration = contestData.contestDuration;
                    existingContest.contestUrl = contestData.contestUrl;
                    if (contestData === null || contestData === void 0 ? void 0 : contestData.solutionVideoInfo)
                        existingContest.solutionVideoInfo = contestData === null || contestData === void 0 ? void 0 : contestData.solutionVideoInfo;
                    yield existingContest.save();
                    return existingContest;
                }
                else {
                    const newContest = new ContestModel_1.default(contestData);
                    yield newContest.save();
                    return newContest;
                }
            }
            catch (error) {
                console.error("Error updating/creating contest:", error);
                throw error;
            }
        });
    }
    getContestById(contestId, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contest = yield ContestModel_1.default.findOne({
                    contestId: contestId,
                    platform: platform,
                });
                return contest;
            }
            catch (error) {
                console.error("Error getting contest by ID:", error);
                throw error;
            }
        });
    }
    getContestByName(contestName, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let contest = yield ContestModel_1.default.findOne({
                    contestName: contestName,
                    platform: platform,
                });
                if (!contest) {
                    contest = yield ContestModel_1.default.findOne({
                        contestName: { $regex: new RegExp("^" + contestName + "$", "i") },
                        platform: platform,
                    });
                }
                if (!contest) {
                    contest = yield ContestModel_1.default.findOne({
                        contestName: { $regex: new RegExp(contestName, "i") },
                        platform: platform,
                    });
                }
                if (!contest) {
                    const allContests = yield ContestModel_1.default.find({ platform: platform });
                    contest =
                        allContests.find((c) => {
                            const normalizedContestName = c.contestName.toLowerCase();
                            const normalizedSearchTerm = contestName.toLowerCase();
                            return (normalizedContestName.includes(normalizedSearchTerm) ||
                                normalizedSearchTerm.includes(normalizedContestName));
                        }) || null;
                }
                return contest;
            }
            catch (error) {
                console.error("Error getting contest by name:", error);
                throw error;
            }
        });
    }
    getAllContests(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const contests = yield ContestModel_1.default.find(query)
                    .sort({ contestStartDate: 1 })
                    .select("-__v");
                return contests;
            }
            catch (error) {
                console.error("Error getting all contests:", error);
                throw error;
            }
        });
    }
    deleteContest(contestId, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ContestModel_1.default.deleteOne({
                    contestId: contestId,
                    platform: platform,
                });
            }
            catch (error) {
                console.error("Error deleting contest:", error);
                throw error;
            }
        });
    }
    deleteAllContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ContestModel_1.default.deleteMany();
                return "All contests deleted successfully";
            }
            catch (error) {
                console.error("Error deleting all contests:", error);
                throw error;
            }
        });
    }
    searchContests(query_1, platform_1) {
        return __awaiter(this, arguments, void 0, function* (query, platform, page = 1, limit = 10) {
            try {
                const searchFilter = {};
                searchFilter.$or = [
                    { contestName: { $regex: new RegExp(query, "i") } },
                    { contestId: { $regex: new RegExp(query, "i") } },
                ];
                if (platform) {
                    searchFilter.platform = platform;
                }
                const skip = (page - 1) * limit;
                const total = yield ContestModel_1.default.countDocuments(searchFilter);
                const contests = yield ContestModel_1.default.find(searchFilter)
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
            }
            catch (error) {
                console.error("Error searching contests:", error);
                throw error;
            }
        });
    }
    getPaginatedContests(startDate_1, endDate_1) {
        return __awaiter(this, arguments, void 0, function* (startDate, endDate, skip = 0, limit = 10) {
            try {
                let query = {};
                if (startDate && endDate) {
                    query.contestStartDate = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    };
                }
                else if (startDate) {
                    query.contestStartDate = { $gte: new Date(startDate) };
                }
                else if (endDate) {
                    query.contestStartDate = { $lte: new Date(endDate) };
                }
                const contests = yield ContestModel_1.default.find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ contestStartDate: -1 });
                return contests;
            }
            catch (error) {
                console.error("Error getting paginated contests:", error);
                throw error;
            }
        });
    }
    getContestsCount(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = {};
                if (startDate && endDate) {
                    query.contestStartDate = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    };
                }
                else if (startDate) {
                    query.contestStartDate = { $gte: new Date(startDate) };
                }
                else if (endDate) {
                    query.contestStartDate = { $lte: new Date(endDate) };
                }
                const count = yield ContestModel_1.default.countDocuments(query);
                return count;
            }
            catch (error) {
                console.error("Error getting contests count:", error);
                throw error;
            }
        });
    }
    updateContestSolution(_id, solutionInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedContest = yield ContestModel_1.default.findOneAndUpdate({ _id: _id }, {
                    $set: {
                        solutionVideoInfo: solutionInfo,
                    },
                }, { new: true });
                return updatedContest;
            }
            catch (error) {
                console.error("Error updating contest solution:", error);
                throw error;
            }
        });
    }
}
exports.default = EventRepository;
