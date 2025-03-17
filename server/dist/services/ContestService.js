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
const LeetcodeServices_1 = __importDefault(require("./LeetcodeServices"));
const CodechefServices_1 = __importDefault(require("./CodechefServices"));
const CodeforcesServices_1 = __importDefault(require("./CodeforcesServices"));
const ContestModel_1 = __importDefault(require("../models/ContestModel"));
class ContestService {
    constructor() {
        this.leetcodeService = new LeetcodeServices_1.default();
        this.codechefService = new CodechefServices_1.default();
        this.codeforcesService = new CodeforcesServices_1.default();
    }
    getUpcomingContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = { contestStartDate: { $gte: new Date() } };
                // console.log("Query:", query);
                const allContests = yield ContestModel_1.default.find(query).sort({
                    contestStartDate: 1,
                });
                // console.log("Upcoming Contests:", allContests);
                return allContests;
            }
            catch (error) {
                console.error("Error fetching upcoming contests:", error);
                throw error;
            }
        });
    }
    updateAllContests() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.leetcodeService.saveLeetcodeActiveContests();
                yield this.leetcodeService.saveLeetcodePastContests();
                yield this.codechefService.saveCodechefActiveContests();
                yield this.codechefService.saveCodechefPastContests();
                yield this.codeforcesService.saveCodeforcesContests();
                console.log("All contests updated successfully.");
            }
            catch (error) {
                console.error("Error updating contests:", error);
            }
        });
    }
}
exports.default = new ContestService();
