import { getDaysInMonth, getWeekOfMonth } from "date-fns";
import { platformNames } from "../data/data";
import { platformDarkIconMap, platformIconMap } from "../data/PlatformIconmap";
import { ContestSchema } from "../types/contestTypes";

export const getPlatformIcon = (
  platformName: string,
  currentTheme: string
): string | undefined => {
  const normalizedPlatformName = platformName.toLocaleLowerCase();

  if (platformIconMap.has(normalizedPlatformName)) {
    return currentTheme === "dark"
      ? platformDarkIconMap.get(normalizedPlatformName)
      : platformIconMap.get(normalizedPlatformName);
  } else {
    return "/notfound.jpg";
  }
};

export const formatTime = (date: Date): string => {
  const dateObj = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };
  return dateObj.toLocaleTimeString("en-US", options);
};

export const convertUtcStringToIndianString = (utcString: Date) => {
  const offset = 5.5 * 60 * 60 * 1000;
  const utcDate = new Date(utcString);
  const indianTime = new Date(utcDate.getTime() + offset);
  const year = indianTime.getUTCFullYear();
  const month = String(indianTime.getUTCMonth() + 1).padStart(2, "0");
  const date = String(indianTime.getUTCDate()).padStart(2, "0");
  const hours = String(indianTime.getUTCHours()).padStart(2, "0");
  const minutes = String(indianTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(indianTime.getUTCSeconds()).padStart(2, "0");
  const isoString = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}.000+05:30`;
  return isoString;
};

export const generateGoogleCalendarUrl = (contest: ContestSchema) => {
  const startDateISO = convertUtcStringToIndianString(contest.contestStartDate)
    .replace(/[-:.]/g, "")
    .slice(0, -1);
  const endDateISO = convertUtcStringToIndianString(contest.contestEndDate)
    .replace(/[-:.]/g, "")
    .slice(0, -1);

  const details = encodeURIComponent(
    `[${platformNames.get(contest.platform)}]: ${contest.contestName}`
  );

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    contest.contestName
  )}&dates=${startDateISO}/${endDateISO}&details=${details}&sf=true&output=xml&location=${
    contest.contestUrl
  }`;

  return googleCalendarUrl;
};

const getMidMonthAndCurrentMonth = (
  currentMonth: { start: Date; end: Date },
  contestStartDate: Date
) => {
  const midDate = new Date(currentMonth.start);
  const y = midDate.getDate();
  if (y + 15 > getDaysInMonth(currentMonth.start)) {
    midDate.setDate(15);
    midDate.setMonth(midDate.getMonth() + 1);
  } else midDate.setDate(midDate.getDate() + 15);

  const contestMonth = new Date(contestStartDate).getMonth() + 1;
  const midMonth = midDate.getMonth() + 1;
  return { midMonth, contestMonth };
};

export const getCaretPosition = (
  contestStartDate: Date,
  width: number,
  currentMonth: { start: Date; end: Date }
) => {
  const day = new Date(contestStartDate).getDay();
  const weekNo = getWeekOfMonth(contestStartDate);
  let x = "";
  if (day < 4) x = "left-[2px]";
  else x = `right-[${width}px]`;
  const { midMonth, contestMonth } = getMidMonthAndCurrentMonth(
    currentMonth,
    contestStartDate
  );
  if (weekNo < 4) {
    if (midMonth === contestMonth) {
      x += " sm:-top-[21px]";
    } else x += " sm:-bottom-[21px] rotate-180";
  } else {
    if (midMonth === contestMonth) {
      x += " sm:-bottom-[21px] rotate-180";
    } else {
      x += " sm:-top-[21px]";
    }
  }
  return x;
};

export const getFormattedTimeStamp = (date: Date): string => {
  const dateObj = new Date(date);

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("en-US", { month: "long" });
  const year = dateObj.getFullYear();

  let daySuffix = "th";
  if (day === 1 || day === 21 || day === 31) {
    daySuffix = "st";
  } else if (day === 2 || day === 22) {
    daySuffix = "nd";
  } else if (day === 3 || day === 23) {
    daySuffix = "rd";
  }

  return `${day}${daySuffix} ${month}, ${year}`;
};

export const getModalPosition = (
  contestStartDate: Date,
  currentMonth: { start: Date; end: Date }
) => {
  const day = new Date(contestStartDate).getDay();
  const weekNo = getWeekOfMonth(contestStartDate);
  let x = "";
  if (day === 0 || day === 1 || day === 2 || day === 3) x = "sm:left-0";
  else x = "sm:right-[85px]";
  const { midMonth, contestMonth } = getMidMonthAndCurrentMonth(
    currentMonth,
    contestStartDate
  );
  if (weekNo < 4) {
    if (midMonth === contestMonth) {
      x += " sm:top-8";
    } else x += " sm:bottom-10";
  } else {
    if (midMonth === contestMonth) {
      x += " sm:bottom-10";
    } else {
      x += " sm:top-8";
    }
  }
  return x;
};

export const filterByQuery = (
  data: ContestSchema[],
  query: string
): ContestSchema[] => {
  if (!query || query.length === 0) return data;
  const lowerCaseQuery = query.toLowerCase();
  return data.filter((contest) => {
    return contest.contestName.toLowerCase().includes(lowerCaseQuery);
  });
};

export const filterContestsData = (
  data: ContestSchema[],
  query: string,
  platforms: string[]
): ContestSchema[] => {
  const filteredByQuery = filterByQuery(data, query);
  const filteredByPlatforms = filterDataByPlatforms(filteredByQuery, platforms);
  return filteredByPlatforms;
};

export const filterDataByPlatforms = (
  data: ContestSchema[],
  platforms: string[]
) => {
  return data.filter((x) => platforms.includes(x.platform));
};

export const groupContestsByDate = (
  contests: ContestSchema[]
): Record<string, ContestSchema[]> => {
  const groupedContests = contests.reduce((acc, contest) => {
    const date = new Date(contest.contestStartDate).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(contest);
    return acc;
  }, {} as Record<string, ContestSchema[]>);
  return groupedContests;
};
