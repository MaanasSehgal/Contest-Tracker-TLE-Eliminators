import { useEffect, useState } from "react";
import { ContestSchema } from "../../types/contestTypes";
import {
  ArrowSquareOut,
  Empty,
  MapPinPlus,
  Warning,
} from "@phosphor-icons/react";
import {
  filterContestsData,
  formatTime,
  generateGoogleCalendarUrl,
  groupContestsByDate,
} from "../../utils/helper";
import contestCalendarStore from "../../zustand/contestCalendar.store";
import { contestsSupportedPlatforms } from "../../data/data";
import { getPlatformIcon } from "../../utils/helper";
import { format } from "date-fns";
import useStore from "../../zustand/useStore.store";

export default function UpcomingContests() {
  const upcomingContests = contestCalendarStore(
    (state) => state.upcomingContests
  );
  const setUpcomingContests = contestCalendarStore(
    (state) => state.setUpcomingContests
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const platforms = contestCalendarStore((state) => state.platforms);
  const query = contestCalendarStore((state) => state.query);
  const [filteredUpcomingContests, setFilteredUpcomingContests] = useState<
    ContestSchema[]
  >([]);

  useEffect(() => {
    (async function () {
      try {
        let url = `${process.env.REACT_APP_BACKEND_URL}/upcoming-contests`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === "success") {
          setUpcomingContests(data.data);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (platforms.length === 0) {
      setFilteredUpcomingContests(
        filterContestsData(upcomingContests, query, contestsSupportedPlatforms)
      );
    } else {
      setFilteredUpcomingContests(
        filterContestsData(upcomingContests, query, platforms)
      );
    }
  }, [query, platforms, upcomingContests]);

  return (
    <div className="overflow-hidden no-scrollbar rounded-md z-0 w-full">
      <div className="mb-2">
        <h2 className="text-2xl leading-9 font-[500] text-gray-600 dark:text-[#F0F0F0]">
          Upcoming Contests
        </h2>
        <p className="text-sm leading-6 text-gray-600 dark:text-darkText-400">
          Don't miss scheduled events
        </p>
        <hr className="my-2 border dark:border-darkBorder-800" />
      </div>
      <Contests
        upcomingContests={filteredUpcomingContests}
        error={error}
        loading={loading}
      />
    </div>
  );
}

const Contests = ({
  upcomingContests,
  error,
  loading,
}: {
  upcomingContests: ContestSchema[];
  error: boolean;
  loading: boolean;
}) => {
  const today = new Date().toLocaleDateString();
  const groupedContests = groupContestsByDate(upcomingContests);
  const bookmarkedContestIds = contestCalendarStore(
    (state) => state.bookmarkedContestIds
  );

  if (loading)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="p-4 bg-white border-gray-200 dark:bg-darkBox-900 dark:border-darkBorder-800 border h-[60px] rounded-lg white animate-pulse"
          ></div>
        ))}
      </div>
    );
  if (error)
    return (
      <div className="flex items-center gap-2 p-4 bg-white border-gray-200 dark:bg-darkBox-900 dark:border-darkBorder-800 border rounded-[md]">
        <div className="text-red-500">
          <Warning size={24} weight="fill" />
        </div>
        <span className="text-red-500 font-[450]">
          Failed to fetch upcoming contests
        </span>
      </div>
    );
  if (upcomingContests.length === 0)
    return (
      <div className="flex items-center gap-2 p-4 bg-white border border-gray-200 dark:bg-darkBox-900 dark:border-darkBorder-800 rounded-xl">
        <div className="text-gray-500">
          <Empty size={24} weight="fill" />
        </div>
        <span className="text-gray-500  font-[450]">
          No upcoming contests found
        </span>
      </div>
    );

  return (
    <div
      className={`flex flex-col gap-2 overflow-y-auto ${
        bookmarkedContestIds.length === 0 ? "h-[696px]" : "h-[348px]"
      } mb-4 md:mb-0`}
    >
      {Object.keys(groupedContests).map((date, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-zinc-400 dark:text-darkText-500 text-xs font-[450]">
              {date === today ? "Today" : date}
            </h3>
          </div>
          {groupedContests[date].map((contest, index) => (
            <ContestCard key={index} contest={contest} />
          ))}
        </div>
      ))}
    </div>
  );
};

export function ContestCard({ contest }: { contest: ContestSchema }) {
  const currentTheme = useStore((state) => state.currentTheme);

  return (
    <div className="flex flex-col flex-1 no-scrollbar min-w-[300px] w-full lg:max-w-[400px] gap-2 p-4 bg-white dark:bg-darkBox-900 dark:border-darkBorder-800 border border-gray-300 rounded-xl">
      <div className="flex items-center">
        <div className="inline-block w-3 h-3 ml-2 mr-1 rounded-full bg-purple-500"></div>
        <div className="inline-flex items-center ml-2 text-sm text-gray-500 dark:text-darkText-400 ">
          <span className="mr-2">
            {format(new Date(contest.contestStartDate), "dd-MM-yyyy")}
          </span>
          <div className="flex gap-1 ">
            <span>{formatTime(contest.contestStartDate)}</span>
            <span>-</span>
            <span>{formatTime(contest.contestEndDate)}</span>
          </div>
        </div>
      </div>

      <div
        title={contest.contestName}
        className="flex items-center text-gray-500 cursor-pointer dark:text-darkText-400"
      >
        <div className="flex items-center justify-center w-8">
          <img
            className={`w-auto h-4 min-w-4 max-w-6 mix-blend-darken dark:mix-blend-normal`}
            src={getPlatformIcon(contest.platform, currentTheme)}
            alt={contest.platform}
            loading="lazy"
          />
        </div>
        <h3 className=" w-full overflow-hidden whitespace-nowrap text-sm font-[450]">
          {contest.contestName}
        </h3>
      </div>

      <div className="flex items-center justify-between text-primary dark:text-purple-500">
        <div className="flex items-center gap-2">
          <MapPinPlus
            className="ml-1 text-gray-400 dark:text-darkText"
            size={18}
            weight="fill"
          />
          <a
            className="text-xs underline "
            href={generateGoogleCalendarUrl(contest)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Add to Calendar
          </a>
        </div>
        <a href={contest.contestUrl} target="_blank" rel="noopener noreferrer">
          <ArrowSquareOut className="text-primary" size={20} />
        </a>
      </div>
    </div>
  );
}
