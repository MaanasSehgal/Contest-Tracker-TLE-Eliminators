import axios from "axios";
import { codeforcesUrl } from "./platforms";
import EventRepository from "../repository/EventRepository";
import { generateContestSchemaDataFromApiData } from "../utils/contest.utils";
import { Contest } from "../src/types/contest.types";

const eventRepository = new EventRepository();

interface CodeforcesContestApiResponse {
    id: number;
    name: string;
    type: string;
    startTimeSeconds: number;
    durationSeconds: number;
}

class CodeforcesServices {
    async getCodeforcesContests(): Promise<Contest[]> {
        try {
            const response = await axios.get(codeforcesUrl);
            if (response.status === 200) {
                const data = response.data.result;
                const contestData = data.map((contest: any) =>
                    this.convertCodeforcesContestToSchemaData(contest)
                );

                return contestData;
            } else {
                throw new Error("Failed to fetch contests from Codeforces API");
            }
        } catch (error: any) {
            throw error;
        }
    }

    private convertCodeforcesContestToSchemaData(
        contest: CodeforcesContestApiResponse
    ): Contest {
        const startTime = new Date(contest.startTimeSeconds * 1000);
        const duration = contest.durationSeconds;
        const endTime = new Date(startTime.getTime() + duration * 1000);

        return generateContestSchemaDataFromApiData({
            platform: "codeforces",
            contestId: contest.type + contest.id.toString(),
            contestName: contest.name,
            contestStartDate: startTime,
            contestEndDate: endTime,
            contestDuration: duration,
            contestUrl: `https://codeforces.com/contest/${contest.id}`,
        });
    }

    async saveCodeforcesContests() {
        try {
            const contests = await this.getCodeforcesContests();

            if (contests && contests.length > 0) {
                await Promise.all(
                    contests.map(async (contest) => {
                        try {
                            const data = await eventRepository.updateContest(contest);
                            return data;
                        } catch (error) {
                            console.error("Error saving Codeforces contest:", error);
                        }
                    })
                );
                console.log("Codeforces contests updated successfully");
            }
        } catch (error) {
            console.error("Error saving Codeforces contests:", error);
            throw error;
        }
    }
}

export default CodeforcesServices;
