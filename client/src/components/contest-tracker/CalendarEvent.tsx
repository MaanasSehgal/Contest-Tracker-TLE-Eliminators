import { EventContentArg } from "@fullcalendar/core";
import { useState } from "react";
import Modal from "./Modal";
import { ContestSchema } from "../../types/contestTypes";
import { getPlatformIcon } from "../../utils/helper";
import useStore from "../../zustand/useStore.store";
import { motion } from "framer-motion";

export function CalendarEvent({
  eventInfo,
  events,
}: {
  eventInfo: EventContentArg;
  events: ContestSchema[];
}) {
  const event = events.find((e) => e._id === eventInfo.event.title);
  const [modalOpen, setModalOpen] = useState(false);
  const currentTheme = useStore((state) => state.currentTheme);

  if (!event) return null;

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative group w-[98%] mx-auto px-2 py-1 text-gray-600 dark:text-darkText-400 font-[450] bg-gray-50 dark:bg-[#27272A] border dark:border-darkBorder-800 border-gray-200 rounded-sm cursor-pointer"
        onClick={openModal}
        style={{
          overflow: "hidden",
          whiteSpace: "pre-wrap",
          textOverflow: "ellipsis",
          maxWidth: "100%",
        }}
        title={event.contestName}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
      >
        <div className="flex flex-col items-start gap-1">
          <div className="relative flex items-center gap-1 text-xs group">
            <img
              src={getPlatformIcon(event.platform, currentTheme)}
              alt={event.contestName}
              className={`w-auto max-w-5 h-4 mix-blend-darken dark:mix-blend-normal `}
              loading="lazy"
            />
            <span className="whitespace-nowrap">{event.contestName}</span>
          </div>
        </div>
      </motion.div>

      {modalOpen && <Modal contest={event} onClose={closeModal} />}
    </>
  );
}
