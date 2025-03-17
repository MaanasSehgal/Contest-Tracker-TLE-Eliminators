import { Laptop } from "@phosphor-icons/react";
import { PlatformSelector } from "./PlatformsSelector";
import contestCalendarStore from "../../zustand/contestCalendar.store";

export default function CalenderHeader() {
  const setQuery = contestCalendarStore((state) => state.setQuery);
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("query") as string;
    setQuery(newQuery);
  }
  return (
    <div className="flex flex-col justify-end w-full gap-2 mb-2 lg:gap-4 sm:flex-row md:flex-col lg:flex-row">
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-1 bg-white dark:bg-darkBox-900 dark:border-darkBorder-800 border rounded-md p-0.5"
      >
        <label htmlFor="query" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 flex items-center px-1.5 pointer-events-none start-0">
            <Laptop className="text-zinc-400" size={24} />
          </div>
          <input
            type="text"
            id="query"
            name="query"
            className="bg-white dark:bg-darkBox-900 outline-none resize-none border-zinc-300 text-zinc-500 text-sm rounded-lg focus:ring-purple-500 placeholder:text-zinc-500 focus:border-primary block w-full ps-10 p-1.5   "
            placeholder="Search Contests"
          />
        </div>
        <button
          type="submit"
          className="h-full p-3 text-sm font-medium text-zinc-400 rounded-lg bg-primary ms-2 hover:bg-primaryHover focus:ring-0 focus:outline-none"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span className="sr-only">Search</span>
        </button>
      </form>
      <PlatformSelector />
    </div>
  );
}
