import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import "./Calendar.css";
import contestCalendarStore from "../../zustand/contestCalendar.store";
import toast from "react-hot-toast";
import { ContestSchema } from "../../types/contestTypes";
import { CalendarEvent } from "./CalendarEvent";
import { filterContestsData } from "../../utils/helper";
import { contestsSupportedPlatforms } from "../../data/data";

export default function MonthlyCalendar() {
  const query = contestCalendarStore((state) => state.query);
  const [events, setEvents] = useState<ContestSchema[]>([]);
  const contests = contestCalendarStore((state) => state.contests);
  const setContests = contestCalendarStore((state) => state.setContests);
  const setCurrentMonth = contestCalendarStore(
    (state) => state.setCurrentMonth
  );

  const calendarRef = useRef<FullCalendar>(null);
  const platforms = contestCalendarStore((state) => state.platforms);
  const updateEvents = async (start: Date, end: Date) => {
    try {
      const params = new URLSearchParams();
      if (start) params.append("startDate", start.toISOString());
      if (end) params.append("endDate", end.toISOString());
      let url = `${process.env.REACT_APP_BACKEND_URL}/contests`;

      if (params.toString()) {
        url += "?" + params;
      }
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "success") {
        setContests(data.data);
      } else {
        toast.error("Error in fetching data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in fetching data");
    }
  };

  useEffect(() => {
    if (platforms.length === 0) {
      const x = filterContestsData(contests, query, contestsSupportedPlatforms);
      setEvents(x);
    } else {
      const y = filterContestsData(contests, query, platforms);
      setEvents(y);
    }
  }, [query, platforms, contests]);

  const handleDatesSet = (info: DatesSetArg) => {
    setCurrentMonth({ start: new Date(info.start), end: new Date(info.end) });
    updateEvents(info.start, info.end);
  };

  return (
    <div className="flex-1 px-2 py-2 bg-white border dark:bg-darkBox-900 dark:border-darkBorder-800 h-fit rounded-xl md:p-2 lg:p-4">
      <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      dayMaxEvents={4}
      events={events.map((event) => {
        return {
        title: event._id,
        date: event.contestStartDate,
        end: event.contestEndDate,
        };
      })}
      datesSet={handleDatesSet}
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "",
      }}
      initialDate={new Date()}
      eventContent={(eventInfo) => (
        <CalendarEvent eventInfo={eventInfo} events={events} />
      )}
      height={738}
      />
    </div>
  );
}
