import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Youtube } from "lucide-react";
import useStore from "../../zustand/useStore.store";

interface SolutionModalProps {
  solutionInfo: {
    title: string;
    url: string;
    thumbnail?: string;
  };
  onClose: () => void;
}

const SolutionModal: React.FC<SolutionModalProps> = ({
  solutionInfo,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const currentTheme = useStore((state) => state.currentTheme);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOpenVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(solutionInfo.url, "_blank");
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, []);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      y: 10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.03,
      boxShadow:
        currentTheme === "dark"
          ? "0 0 15px rgba(239, 68, 68, 0.4)"
          : "0 0 10px rgba(239, 68, 68, 0.3)",
    },
    tap: { scale: 0.97 },
  };

  const purpleNeonShadow =
    currentTheme === "dark"
      ? "0 0 20px rgba(168, 85, 247, 0.5)"
      : "0 0 15px rgba(168, 85, 247, 0.4)";

  return (
    <AnimatePresence onExitComplete={() => onClose()}>
      {isVisible && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={modalRef}
            className="relative w-[95%] max-w-md p-6 z-[110] bg-white dark:bg-darkBox-900 border rounded-xl dark:border-darkBorder-800"
            style={{
              boxShadow:
                currentTheme === "dark"
                  ? "0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 5px rgba(255, 255, 255, 0.05)"
                  : "0 10px 30px -5px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
              onClick={handleClose}
              className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 text-gray-500 bg-gray-100 rounded-full dark:bg-darkBox-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-darkBox-700 transition-colors z-10"
            >
              <X size={18} />
            </motion.button>

            <div className="flex flex-col gap-5">
              <div className="pb-3 border-b dark:border-darkBorder-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-darkText-300">
                  Solution Video
                </h2>
              </div>

              {solutionInfo.thumbnail && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer group shadow-md"
                  onClick={handleOpenVideo}
                >
                  <img
                    src={solutionInfo.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-colors">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      whileHover={{
                        scale: 1.1,
                        opacity: 1,
                        boxShadow: "0 0 20px rgba(239, 68, 68, 0.6)",
                      }}
                      className="w-16 h-16 flex items-center justify-center bg-red-600 rounded-full shadow-lg"
                    >
                      <Youtube size={28} className="text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900 dark:text-darkText-300 leading-tight break-words whitespace-normal overflow-hidden">
                  {solutionInfo.title}
                </h3>

                <motion.button
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleOpenVideo}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 rounded-lg hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-darkBox-900 transition-all duration-300 shadow-md"
                >
                  <Youtube size={20} />
                  <span>Watch Solution Video</span>
                </motion.button>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    color: currentTheme === "dark" ? "#a855f7" : "#9333ea",
                    boxShadow: purpleNeonShadow,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={handleClose}
                  className="w-full mt-2 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-darkText-400 bg-gray-100 dark:bg-darkBox-800 rounded-lg hover:bg-gray-200 dark:hover:bg-darkBox-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SolutionModal;
