import { useEffect, useState } from "react";
import { ContestSchema } from "../../types/contestTypes";
import {
  ArrowSquareOut,
  MapPinPlus,
  Star,
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

export default function BookmarkedContests() {
  const contests = contestCalendarStore((state) => state.contests);
  const bookmarkedContestIds = contestCalendarStore(
    (state) => state.bookmarkedContestIds
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, _setError] = useState<boolean>(false);
  const platforms = contestCalendarStore((state) => state.platforms);
  const query = contestCalendarStore((state) => state.query);
  const [bookmarkedContests, setBookmarkedContests] = useState<ContestSchema[]>(
    []
  );
  const [filteredBookmarkedContests, setFilteredBookmarkedContests] = useState<
    ContestSchema[]
  >([]);

  useEffect(() => {
    if (contests.length > 0) {
      const bookmarked = contests.filter((contest) =>
        bookmarkedContestIds.includes(contest._id)
      );

      setBookmarkedContests(bookmarked);
      setLoading(false);
    }
  }, [contests, bookmarkedContestIds]);

  useEffect(() => {
    if (platforms.length === 0) {
      setFilteredBookmarkedContests(
        filterContestsData(
          bookmarkedContests,
          query,
          contestsSupportedPlatforms
        )
      );
    } else {
      setFilteredBookmarkedContests(
        filterContestsData(bookmarkedContests, query, platforms)
      );
    }
  }, [query, platforms, bookmarkedContests]);

  if (bookmarkedContests.length === 0) return <></>;

  return (
    <div className="overflow-hidden no-scrollbar rounded-md z-0 w-full mb-8 max-h-[375px]">
      <div className="mb-2">
        <h2 className="text-2xl leading-9 font-[500] text-gray-600 dark:text-[#F0F0F0]">
          Bookmarked Contests
        </h2>
        <p className="text-sm leading-6 text-gray-600 dark:text-darkText-400">
          Your saved contests
        </p>
        <hr className="my-2 border dark:border-darkBorder-800" />
      </div>
      <Contests
        bookmarkedContests={filteredBookmarkedContests}
        error={error}
        loading={loading}
        setBookmarkedContests={setBookmarkedContests}
      />
    </div>
  );
}

const Contests = ({
  bookmarkedContests,
  error,
  loading,
  setBookmarkedContests,
}: {
  bookmarkedContests: ContestSchema[];
  error: boolean;
  loading: boolean;
  setBookmarkedContests: React.Dispatch<React.SetStateAction<ContestSchema[]>>;
}) => {
  const today = new Date().toLocaleDateString();
  const groupedContests = groupContestsByDate(bookmarkedContests);

  if (loading)
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
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
          Failed to fetch bookmarked contests
        </span>
      </div>
    );

  if (bookmarkedContests.length === 0) return <></>;

  return (
    <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px]">
      {Object.keys(groupedContests).map((date, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-zinc-400 dark:text-darkText-500 text-xs font-[450]">
              {date === today ? "Today" : date}
            </h3>
          </div>
          {groupedContests[date].map((contest, index) => (
            <ContestCard
              key={index}
              contest={contest}
              setBookmarkedContests={setBookmarkedContests}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

function ContestCard({
  contest,
  setBookmarkedContests,
}: {
  contest: ContestSchema;
  setBookmarkedContests: React.Dispatch<React.SetStateAction<ContestSchema[]>>;
}) {
  const currentTheme = useStore((state) => state.currentTheme);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const setBookmarkedContestIds = contestCalendarStore(
    (state) => state.setBookmarkedContestIds
  );
  const bookmarkedContestIds = contestCalendarStore(
    (state) => state.bookmarkedContestIds
  );

  const handleBookmarkToggle = () => {
    if (isBookmarking) return;

    try {
      setIsBookmarking(true);

      // Create a new array without the current contest ID
      const updatedIds = bookmarkedContestIds.filter(
        (id) => id !== contest._id
      );

      // Update the store
      setBookmarkedContestIds(updatedIds);

      // Update local component state
      setBookmarkedContests((prevContests) =>
        prevContests.filter((c) => c._id !== contest._id)
      );
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 no-scrollbar min-w-[300px] w-full lg:max-w-[400px] gap-2 p-4 bg-white dark:bg-darkBox-900 dark:border-darkBorder-800 border border-gray-300 rounded-xl relative">
      <button
        onClick={handleBookmarkToggle}
        disabled={isBookmarking}
        className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 text-yellow-500 hover:text-yellow-600"
      >
        <Star
          size={16}
          weight="fill"
          className={isBookmarking ? "animate-pulse" : ""}
        />
      </button>

      <div className="flex items-center">
        <div className="inline-block w-3 h-3 ml-2 mr-1 rounded-full bg-yellow-500"></div>
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
        <h3 className="w-full overflow-hidden whitespace-nowrap text-sm font-[450]">
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
            className="text-xs underline"
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
