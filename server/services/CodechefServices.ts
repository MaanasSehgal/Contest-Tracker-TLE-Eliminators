import axios from "axios";
import { codechefUrl } from "./platforms";
import EventRepository from '../repository/EventRepository';
import { generateContestSchemaDataFromApiData } from "../utils/contest.utils";
import { Contest } from "../src/types/contest.types";

const eventRepository = new EventRepository();

interface CodechefContestApiResponse {
    contest_code: string;
    contest_name: string;
    contest_start_date: string;
    contest_end_date: string;
    contest_duration: string;
}

export default class CodechefServices {
    async getCodechefPastContests(): Promise<any[]> {
        try {
            const response = await axios.get(codechefUrl);
            const data = response.data;
            if (data.status === "success") {
                const data = response.data.past_contests;
                const contestData = data.map((contest: any) =>
                    this.convertCodechefContestToSchemaData(contest)
                );

                return contestData;
            } else {
                throw new Error("Failed to fetch contests from Codechef API");
            }
        } catch (error: any) {
            throw error;
        }
    }

    async getCodechefFutureContests(): Promise<any> {
        try {
            const response = await axios.get(codechefUrl);
            if (response.data.status === "success") {
                const data = response.data.future_contests;
                const contestData = data.map((contest: any) =>
                    this.convertCodechefContestToSchemaData(contest)
                );

                return contestData;
            } else {
                throw new Error("Failed to fetch contests from Codechef API");
            }
        } catch (error: any) {
            throw error;
        }
    }

    private convertCodechefContestToSchemaData(
        contest: CodechefContestApiResponse
    ): Contest {
        const startTime = new Date(contest.contest_start_date);
        const endTime = new Date(contest.contest_end_date);
        const duration = (endTime.getTime() - startTime.getTime()) / 1000;

        return generateContestSchemaDataFromApiData({
            platform: 'codechef',
            contestId: contest.contest_code,
            contestName: contest.contest_name,
            contestStartDate: startTime,
            contestEndDate: endTime,
            contestDuration: duration,
            contestUrl: `https://www.codechef.com/${contest.contest_code}`,
        });
    }

    async saveCodechefActiveContests() {
        try {
            const futureContests = await this.getCodechefFutureContests();
            if (futureContests && futureContests.length > 0) {
                console.log("Codechef active contests updated successfully");
                return await Promise.all(
                    futureContests.map(async (contest: any) => {
                        const data = await eventRepository.updateContest(contest);
                        return data;
                    })
                );
            }
        } catch (error) {
            console.error("Error saving Codechef active contest:", error);
            throw error;
        }
    }

    async saveCodechefPastContests() {
        try {
            const futureContests = await this.getCodechefPastContests();
            if (futureContests && futureContests.length > 0) {
                console.log("Codechef past contests updated successfully");
                return await Promise.all(
                    futureContests.map(async (contest) => {
                        const data = await eventRepository.updateContest(contest);
                        return data;
                    })
                );
            }
        } catch (error) {
            console.error("Error saving Codechef past contest:", error);
            throw error;
        }
    }
}
