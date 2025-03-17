import { create } from "zustand";
import { ContestSchema } from "../types/contestTypes";

interface store {
  section: string;
  setSection: (section: string) => void;
  platforms: string[];
  setPlatforms: (platforms: string[]) => void;
  query: string;
  setQuery: (query: string) => void;
  upcomingContests: ContestSchema[];
  setUpcomingContests: (contests: ContestSchema[]) => void;
  currentMonth: {
    start: Date;
    end: Date;
  };
  setCurrentMonth: (currentMonth: { start: Date; end: Date }) => void;
  contests: ContestSchema[];
  setContests: (contests: ContestSchema[]) => void;
  queryContests: ContestSchema[];
  setQueryContests: (queryContests: ContestSchema[]) => void;
  bookmarkedContestIds: string[];
  setBookmarkedContestIds: (ids: string[]) => void;
}

const contestCalendarStore = create<store>()((set) => ({
  section: "all",
  setSection: (section: string) => set({ section }),
  platforms: [],
  setPlatforms: (platforms: string[]) => set({ platforms }),
  query: "",
  setQuery: (query: string) => set({ query }),
  upcomingContests: [],
  setUpcomingContests: (contests: ContestSchema[]) =>
    set({ upcomingContests: contests }),
  currentMonth: { start: new Date(), end: new Date() },
  setCurrentMonth: (currentMonth: { start: Date; end: Date }) =>
    set({ currentMonth }),
  contests: [],
  setContests: (contests: ContestSchema[]) => set({ contests }),
  queryContests: [],
  setQueryContests: (queryContests: ContestSchema[]) => set({ queryContests }),
  bookmarkedContestIds: JSON.parse(
    localStorage.getItem("bookmarkedContests") || "[]"
  ),
  setBookmarkedContestIds: (ids: string[]) => {
    localStorage.setItem("bookmarkedContests", JSON.stringify(ids));
    set({ bookmarkedContestIds: ids });
  },
}));

export default contestCalendarStore;
