import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import useStore from "../zustand/useStore.store";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const currentTheme = useStore((state) => state.currentTheme);

  const purpleNeon = "text-purple-500";
  const purpleNeonShadow =
    currentTheme === "dark"
      ? "0 0 20px rgba(168, 85, 247, 0.5)"
      : "0 0 15px rgba(168, 85, 247, 0.4)";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: purpleNeonShadow,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-dark-900 transition-colors duration-300 flex items-center justify-center">
      <motion.div
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="inline-block"
            initial="initial"
            animate="animate"
          >
            <AlertCircle className={`w-24 h-24 ${purpleNeon} mx-auto mb-6`} />
          </motion.div>
          <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-darkText-300 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-darkText-400 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Perhaps
            you were trying to find a coding contest?
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gray-200 dark:bg-darkBox-800 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-darkBox-700 transition-colors"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors`}
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
