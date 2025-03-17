"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContestSchemaDataFromApiData = void 0;
const generateContestSchemaDataFromApiData = (apiData) => {
    const { platform, contestId, contestName, contestStartDate, contestEndDate, contestDuration, contestUrl } = apiData;
    // console.log(apiData);
    if (!platform || !contestId || !contestName || !contestStartDate || !contestEndDate || !contestDuration || !contestUrl) {
        throw new Error('Missing required fields in API data');
    }
    const contestData = {
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
exports.generateContestSchemaDataFromApiData = generateContestSchemaDataFromApiData;
