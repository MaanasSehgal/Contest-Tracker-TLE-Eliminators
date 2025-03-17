import { CaretDown, CaretUp, Plus } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { platformNames } from "../../data/data";
import { motion } from "framer-motion";
import contestCalendarStore from "../../zustand/contestCalendar.store";
import { contestsSupportedPlatforms } from "../../data/data";
export function PlatformSelector() {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPlatformsLocal, setSelectedPlatformsLocal] = useState<
    string[]
  >([]);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const dropDownContainerRef = useRef<HTMLDivElement>(null);
  const platforms = contestCalendarStore((state) => state.platforms);
  const setPlatforms = contestCalendarStore((state) => state.setPlatforms);
  useEffect(() => {
    setSelectedPlatformsLocal(platforms);
  }, [platforms]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropDownContainerRef.current &&
        !dropDownContainerRef.current.contains(event.target as Node) &&
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  function toggleSelection(platform: string) {
    if (platforms.includes(platform)) {
      setPlatforms(platforms.filter((p) => p !== platform));
    } else {
      setPlatforms([...platforms, platform]);
    }
  }
  return (
    <div className="relative flex-1 lg:w-[50%] md:w-full sm:w-[50%] w-full p-2 border rounded-md bg-white dark:bg-darkBox-900 dark:border-darkBorder-800">
      <div className="flex justify-between  w-full mt-0.5">
        <div className="justify-start w-[95%]">
          {platforms.length === 0 ||
          platforms.length === contestsSupportedPlatforms.length ? (
            <button
              onClick={() => setOpen(!open)}
              className="w-full text-sm text-zinc-500 text-start"
            >
              All Platforms Selected
            </button>
          ) : (
            <div className="flex items-center h-full gap-1 overflow-scroll no-scrollbar">
              {platforms.map((platform, index) => (
                <button
                  onClick={() => toggleSelection(platform)}
                  key={index}
                  className="flex border gap-1 transition duration-200 py-0.5 bg-gray-200 dark:bg-gray-800 dark:border-darkBox-800 text-gray-500 items-center px-4 rounded-full"
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xs">
                      {platformNames.get(platform)}
                    </span>
                    <span className="rotate-45">
                      <Plus size={12} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.span
          ref={dropDownRef}
          onClick={() => setOpen(!open)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-[5%] text-primary p-1 dark:text-darkText-500"
        >
          {open ? <CaretUp size={20} /> : <CaretDown size={20} />}
        </motion.span>
      </div>
      {open && (
        <motion.div
          ref={dropDownContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="absolute shadow-lg min-h-[120px] right-0 w-full md:w-[70%] p-2 flex flex-col gap-2 bg-white dark:bg-darkBox-900 border border-gray-300 dark:border-darkBorder-800 z-[100] rounded-b-md top-11"
        >
          <div>
            <div className="text-sm text-gray-500 border-b-2 border-gray-500 dark:border-darkBorder-800 w-fit">
              Platforms
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {contestsSupportedPlatforms.map((platform, index) => {
              return (
                <button
                  onClick={() => toggleSelection(platform)}
                  key={index}
                  className={`flex ${
                    selectedPlatformsLocal.includes(platform)
                      ? "bg-gray-200 dark:bg-gray-800 dark:border-darkBorder-800"
                      : "bg-gray-50 dark:bg-darkBox-900 dark:border-darkBorder-800"
                  }  border gap-1 text-gray-500 transition duration-200 py-0.5 flex items-center px-4 rounded-full`}
                >
                  <span className="text-xs ">
                    {platformNames.get(platform)}
                  </span>
                  <span
                    className={` ${
                      selectedPlatformsLocal.includes(platform) && "rotate-45"
                    } transition-all duration-200`}
                  >
                    <Plus size={12} />
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
