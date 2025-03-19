import BookmarkedContests from "../components/contest-tracker/BookmarkedContests";
import CalenderHeader from "../components/contest-tracker/CalendarHeader";
import MonthlyCalendar from "../components/contest-tracker/MonthlyCalendar";
import UpcomingContests from "../components/contest-tracker/UpcomingContests";

export default function ContestTracker() {
  return (
    <main className="bg-gray-50 dark:bg-dark-900">
      <div className="flex flex-col w-full h-auto gap-2 px-4 pt-2 pb-4 mx-auto overflow-visible md:gap-4">
        <div className="mt-4 md:mt-8">
          <CalenderHeader />
        </div>
        <div className="flex flex-col w-full gap-2 md:gap-4 md:flex-row">
          <div className="flex flex-col md-max-w-[30%]">
            <BookmarkedContests />
            <UpcomingContests />
          </div>
          <div className="flex-1">
            <MonthlyCalendar />
          </div>
        </div>
      </div>
    </main>
  );
}
