import React, { useEffect, useState } from "react";
import useStore from "../../zustand/useStore.store";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Calendar, Video, ClipboardList } from "lucide-react"; // Video and ClipboardList icons

const Navbar = () => {
  const { currentTheme, setCurrentTheme } = useStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("contest-tracker")) {
      setActiveTab("contest-tracker");
    } else if (path.includes("post-contest-discussions")) {
      setActiveTab("post-contest-discussions");
    } else if (path.includes("update-contest")) {
      setActiveTab("update-contest");
    } else {
      setActiveTab("/");
    }
  }, [location]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400 },
    },
  };

  const themeButtonVariants = {
    initial: { rotate: 0 },
    hover: {
      rotate: 15,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400 },
    },
    tap: { scale: 0.9 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  return (
    <motion.nav
      className="bg-white dark:bg-darkBox-900 shadow-md transition-colors duration-300 border-b dark:border-darkBorder-800"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            variants={itemVariants}
          >
            <motion.div
              variants={logoVariants}
              initial="initial"
              whileHover="hover"
            >
              <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
                <img
                  src="/icons/tle_eliminators_logo.jpg"
                  alt="Contest Tracker Logo"
                  className="h-8 w-8"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/notfound.jpg";
                  }}
                />
                <span className="text-xl font-bold text-gray-800 dark:text-darkText-300 transition-colors duration-300">
                  TLE <span className="hidden sm:inline-block">Eliminators</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center space-x-6"
            variants={itemVariants}
          >
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex space-x-6"
            >
              {["contest-tracker", "post-contest-discussions", "update-contest"].map((route, index) => (
                <div key={index} className="relative">
                  <Link
                    to={`/${route}`}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      activeTab === route
                        ? "text-purple-600 dark:text-purple-400 font-semibold"
                        : "text-gray-700 dark:text-darkText-300 hover:text-purple-600 dark:hover:text-purple-400"
                    }`}
                  >
                    {route === "contest-tracker" && <Calendar className="h-4 w-4" />}
                    {route === "post-contest-discussions" && <Video className="h-4 w-4" />}
                    {route === "update-contest" && <ClipboardList className="h-4 w-4" />}
                    <span className="hidden sm:block">{route.replace("-", " ").toUpperCase()}</span>
                  </Link>
                </div>
              ))}
            </motion.div>

            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-darkBox-800 transition-colors duration-300 flex items-center justify-center"
              aria-label="Toggle theme"
              variants={themeButtonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {currentTheme === "light" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-300" />
              )}
            </motion.button>

            <motion.div className="lg:hidden" variants={itemVariants}>
              <motion.button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 dark:text-darkText-300 hover:bg-gray-100 dark:hover:bg-darkBox-800 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-50 lg:hidden bg-white dark:bg-darkBox-900 pt-16"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="relative h-full">
              <motion.button
                onClick={closeMenu}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-darkBox-800 text-gray-700 dark:text-darkText-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </motion.button>
              
              <div className="px-4 py-6 space-y-6 mt-8">
                {["contest-tracker", "post-contest-discussions", "update-contest"].map((route, index) => (
                  <Link
                    key={index}
                    to={`/${route}`}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors duration-300 ${
                      activeTab === route
                        ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "text-gray-700 dark:text-darkText-300 hover:bg-gray-100 dark:hover:bg-darkBox-800"
                    }`}
                  >
                    {route === "contest-tracker" && <Calendar className="h-5 w-5" />}
                    {route === "post-contest-discussions" && <Video className="h-5 w-5" />}
                    {route === "update-contest" && <ClipboardList className="h-5 w-5" />}
                    <span>{route.replace("-", " ").toUpperCase()}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
