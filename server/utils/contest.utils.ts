import { Contest } from "../src/types/contest.types";

interface ApiContestData {
    platform: string;
    contestId: string;
    contestName: string;
    contestStartDate: Date;
    contestEndDate: Date;
    contestDuration: number;
    contestUrl: string;
    [key: string]: any;
}

export const generateContestSchemaDataFromApiData = (
    apiData: ApiContestData
): Contest => {
    const { platform, contestId, contestName, contestStartDate, contestEndDate, contestDuration, contestUrl } = apiData;

    // console.log(apiData);

    if (!platform || !contestId || !contestName || !contestStartDate || !contestEndDate || !contestDuration || !contestUrl) {
        throw new Error('Missing required fields in API data');
    }

    const contestData: Contest = {
        platform: platform,
        contestId: contestId,
        contestName: contestName,
        contestStartDate: new Date(contestStartDate),
        contestEndDate: new Date(contestEndDate),
        contestDuration: contestDuration,
        contestUrl: contestUrl,
    };

    return contestData;
};
