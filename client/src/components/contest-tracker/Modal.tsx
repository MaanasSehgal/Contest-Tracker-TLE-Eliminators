import {
  Calendar, CaretUp, Clock, MapPin, Timer, X, CalendarPlus, Link, Star, VideoCamera,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { platformNames } from "../../data/data";
import { ContestSchema } from "../../types/contestTypes";
import {
  formatTime,
  generateGoogleCalendarUrl,
  getCaretPosition,
  getFormattedTimeStamp,
  getModalPosition,
} from "../../utils/helper";
import TimerComponent from "./Timer";
import contestCalendarStore from "../../zustand/contestCalendar.store";
import { getPlatformIcon } from "../../utils/helper";
import useStore from "../../zustand/useStore.store";
import SolutionModal from "./SolutionModal";

interface ModalProps {
  contest: ContestSchema;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ contest, onClose }) => {
  const currentMonth = contestCalendarStore((state) => state.currentMonth);
  const bookmarkedContestIds = contestCalendarStore((state) => state.bookmarkedContestIds);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const currentTheme = useStore((state) => state.currentTheme);
  const [isVisible, setIsVisible] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(() => {
    return bookmarkedContestIds.includes(contest._id);
  });
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [showSolutionModal, setShowSolutionModal] = useState(false);

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.98 },
  };

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      setIsMobile(viewportWidth < 640);
    };
    if (isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const formatContestDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (minutes === 0) {
      return `${hours} hrs`;
    } else {
      return `${hours} hrs ${minutes} mins`;
    }
  };
  const handleBookmarkToggle = () => {
    if (isBookmarking) return;

    try {
      setIsBookmarking(true);
      const newBookmarkState = !isBookmarked;

      const bookmarkedContestIds = contestCalendarStore.getState().bookmarkedContestIds;
      let updatedIds = [...bookmarkedContestIds];

      if (newBookmarkState) {
        if (!updatedIds.includes(contest._id)) {
          updatedIds.push(contest._id);
        }
      } else {
        updatedIds = updatedIds.filter(id => id !== contest._id);
      }

      contestCalendarStore.getState().setBookmarkedContestIds(updatedIds);

      setIsBookmarked(newBookmarkState);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleOpenSolutionModal = () => {
    setShowSolutionModal(true);
  };

  const handleCloseSolutionModal = () => {
    setShowSolutionModal(false);
  };

  useEffect(() => {
    if (!showSolutionModal) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
    return () => { };
  }, [onClose, showSolutionModal]);

  const hasSolution =
    contest.solutionVideoInfo && contest.solutionVideoInfo.url;

  return (
    <>
      <AnimatePresence onExitComplete={() => onClose()}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed overflow-x-hidden inset-0 top-0 bottom-0 left-0 sm:inset-auto sm:absolute z-[100] flex items-center justify-center right-0 sm:bg-transparent h-full ${getModalPosition(
              contest.contestStartDate,
              currentMonth
            )} sm:h-fit`}
          >
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              ref={modalRef}
              className="relative w-[95%] sm:w-[400px] p-3 z-[100] bg-white dark:bg-darkBox-900 border rounded-lg dark:border-darkBorder-800 shadow-lg overflow-x-hidden overflow-y-hidden no-scrollbar"
              style={{
                boxShadow:
                  currentTheme === "dark"
                    ? "0 8px 20px -5px rgba(0, 0, 0, 0.4)"
                    : "0 8px 20px -5px rgba(0, 0, 0, 0.1)",
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto"
              }}
            >
              <CaretUp
                className={`absolute hidden md:block -right-[2px] text-white dark:text-darkBox-900 drop-shadow-md ${getCaretPosition(
                  contest.contestStartDate,
                  modalRef?.current?.offsetWidth ?? 85,
                  currentMonth
                )}`}
                size={32}
                weight="fill"
              />

              <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={handleBookmarkToggle}
                  disabled={isBookmarking}
                  className={`flex items-center justify-center w-6 h-6 rounded-full ${isBookmarked
                    ? "text-yellow-500 hover:text-yellow-600"
                    : "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    }`}
                >
                  <Star
                    size={14}
                    weight={isBookmarked ? "fill" : "regular"}
                    className={isBookmarking ? "animate-pulse" : ""}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={handleClose}
                  className="flex items-center justify-center w-6 h-6 text-gray-500 bg-gray-100 rounded-full dark:bg-darkBox-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-darkBox-700"
                >
                  <X size={14} weight="bold" />
                </motion.button>
              </div>

              <div className="flex flex-col gap-2.5 p-2">
                <div className="flex items-center gap-2 pb-2 border-b dark:border-darkBorder-800 pr-12">
                  <div className="flex items-center justify-center w-6 h-6 overflow-hidden bg-gray-100 rounded-md dark:bg-darkBox-800">
                    <img
                      src={getPlatformIcon(
                        contest.platform.toLocaleLowerCase(),
                        currentTheme
                      )}
                      alt={`${contest.platform} logo`}
                      className="w-3.5 h-3.5 object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="max-w-[calc(100%-40px)] overflow-hidden">
                    <p className="text-xs font-medium text-gray-500 dark:text-darkText-500">
                      {platformNames.get(contest.platform)}
                    </p>
                    <h2
                      className="text-xs font-semibold text-gray-900 dark:text-darkText-300 truncate"
                      title={contest.contestName}
                    >
                      {contest.contestName}
                    </h2>
                  </div>
                </div>

                <div className="p-1.5 bg-gray-50 dark:bg-darkBox-800 rounded-lg">
                  <TimerComponent
                    expiryTimestamp={new Date(contest.contestStartDate)}
                    endTimestamp={new Date(contest.contestEndDate)}
                  />
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="flex flex-col p-1.5 bg-gray-50 dark:bg-darkBox-800 rounded-md col-span-2">
                    <div className="flex items-center gap-1 mb-0.5 text-purple-600 dark:text-purple-400">
                      <Calendar size={12} weight="regular" />
                      <span className="font-medium text-[10px]">Date</span>
                    </div>
                    <span className="text-[10px] text-gray-700 dark:text-darkText-400">
                      {getFormattedTimeStamp(
                        contest.contestStartDate
                      ).toString()}
                    </span>
                  </div>

                  <div className="flex flex-col p-1.5 bg-gray-50 dark:bg-darkBox-800 rounded-md col-span-2">
                    <div className="flex items-center gap-1 mb-0.5 text-primary dark:text-primaryHover">
                      <Clock size={12} weight="regular" />
                      <span className="font-medium text-[10px]">Time</span>
                    </div>
                    <span className="text-[10px] text-gray-700 dark:text-darkText-400">
                      {formatTime(contest.contestStartDate)} - {formatTime(contest.contestEndDate)}
                    </span>
                  </div>

                  <div className="flex flex-col p-1.5 bg-gray-50 dark:bg-darkBox-800 rounded-md col-span-2">
                    <div className="flex items-center gap-1 mb-0.5 text-green-600 dark:text-green-400">
                      <Timer size={12} weight="regular" />
                      <span className="font-medium text-[10px]">Duration</span>
                    </div>
                    <span className="text-[10px] text-gray-700 dark:text-darkText-400">
                      {formatContestDuration(contest.contestDuration)}
                    </span>
                  </div>

                  <div className="flex flex-col p-1.5 bg-gray-50 dark:bg-darkBox-800 rounded-md col-span-2">
                    <div className="flex items-center gap-1 mb-0.5 text-amber-600 dark:text-amber-400">
                      <MapPin size={12} weight="regular" />
                      <span className="font-medium text-[10px]">Link</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(contest.contestUrl, "_blank");
                      }}
                      className="text-start overflow-hidden text-primary dark:text-darkText-400 hover:text-primaryHover dark:hover:text-gray-300 truncate max-w-full block text-[10px]"
                      title={contest.contestUrl}
                    >
                      {contest.contestUrl.length > 15
                        ? `${contest.contestUrl.substring(0, 15)}...`
                        : contest.contestUrl}
                    </button>
                  </div>
                </div>

                {hasSolution && (
                  <div className="flex items-center p-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-md">
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center bg-green-100 dark:bg-green-900/30 rounded-full">
                        <VideoCamera
                          size={12}
                          weight="fill"
                          className="text-green-600 dark:text-green-400"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-medium text-green-800 dark:text-green-400">
                          Solution available
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenSolutionModal}
                        className="text-[10px] font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      >
                        View
                      </motion.button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-0.5">
                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(contest.contestUrl, "_blank");
                    }}
                    className="flex items-center justify-center flex-1 gap-1 px-2 py-1.5 text-[10px] font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-1 dark:focus:ring-offset-darkBox-900"
                  >
                    <Link size={12} weight="bold" />
                    Visit Contest
                  </motion.button>

                  <motion.button
                    variants={buttonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(generateGoogleCalendarUrl(contest), "_blank");
                    }}
                    className="flex items-center justify-center flex-1 gap-1 px-2 py-1.5 text-[10px] font-medium text-purple-600 bg-purple-100 rounded-md hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:ring-offset-1 dark:focus:ring-offset-darkBox-900"
                  >
                    <CalendarPlus size={12} weight="bold" />
                    Add to Calendar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSolutionModal && contest.solutionVideoInfo && (
        <SolutionModal
          solutionInfo={contest.solutionVideoInfo}
          onClose={handleCloseSolutionModal}
        />
      )}
    </>
  );
};

export default Modal;
