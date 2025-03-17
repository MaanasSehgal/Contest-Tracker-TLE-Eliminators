import React from "react";
import { Heart, Github, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { platformNames } from "../../data/data";
import { getPlatformIcon } from "../../utils/helper";
import useStore from "../../zustand/useStore.store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
};

const iconVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.2,
    rotate: 5,
    transition: { type: "spring", stiffness: 400 },
  },
};

const AboutSection: React.FC = () => (
  <motion.div variants={itemVariants} className="flex flex-col space-y-4 items-center text-center md:items-start md:text-left">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText-300">
      Contest Tracker
    </h3>
    <p className="text-gray-600 dark:text-darkText-400 text-sm">
      Your one-stop solution to track competitive programming contests
      across multiple platforms. Never miss a coding competition again!
    </p>
    <div className="flex items-center">
      <p className="text-gray-700 dark:text-darkText-300 text-sm">
        Made with
        <motion.span
          className="inline-block mx-1"
          initial="initial"
          animate="animate"
        >
          <Heart className="inline text-red-500 h-4 w-4 fill-current" />
        </motion.span>
        by{" "}
        <a href="https://www.linkedin.com/in/maanassehgal" className="font-medium text-primary dark:text-purple-500">
          Maanas Sehgal
        </a>
      </p>
    </div>
  </motion.div>
);

interface PlatformItemProps {
  platformKey: string;
  name: string;
  currentTheme: string;
}

const PlatformItem: React.FC<PlatformItemProps> = ({ platformKey, name, currentTheme }) => (
  <div className="flex flex-col items-center">
    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-darkBox-800 flex items-center justify-center mb-1 overflow-hidden">
      <img
        src={getPlatformIcon(platformKey, currentTheme) || "/notfound.jpg"}
        alt={name}
        className="w-5 h-5 object-contain"
        loading="lazy"
      />
    </div>
    <span className="text-xs text-center text-gray-600 dark:text-darkText-400 max-w-[80px] truncate">
      {name}
    </span>
  </div>
);

const PlatformsSection: React.FC = () => {
  const currentTheme = useStore((state) => state.currentTheme);
  
  return (
    <motion.div variants={itemVariants} className="flex flex-col items-center space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText-300">
        Supported Platforms
      </h3>
      <div className="flex flex-row gap-6 justify-center items-center">
        {Array.from(platformNames.entries()).map(([key, name]) => (
          <PlatformItem 
            key={key} 
            platformKey={key} 
            name={name} 
            currentTheme={currentTheme} 
          />
        ))}
      </div>
    </motion.div>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  name: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, name }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 text-gray-600 hover:text-primary dark:text-darkText-400 dark:hover:text-purple-500 transition-colors duration-200 group"
  >
    <motion.div
      variants={iconVariants}
      initial="initial"
      whileHover="hover"
      className="w-8 h-8 rounded-full bg-gray-100 dark:bg-darkBox-800 flex items-center justify-center"
    >
      {icon}
    </motion.div>
    <span className="text-sm group-hover:underline">{name}</span>
  </a>
);

const ConnectSection: React.FC = () => (
  <motion.div variants={itemVariants} className="flex flex-col items-center text-center md:items-start md:text-left space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-darkText-300">
      Connect with me
    </h3>
    <div className="space-y-3">
      <SocialLink 
        href="https://github.com/MaanasSehgal" 
        icon={<Github className="w-4 h-4" />} 
        name="GitHub" 
      />
      <SocialLink 
        href="https://www.linkedin.com/in/maanassehgal/" 
        icon={<Linkedin className="w-4 h-4" />} 
        name="LinkedIn" 
      />
    </div>
  </motion.div>
);

const Copyright: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.div
      className="mt-8 pt-6 border-t border-gray-200 dark:border-darkBorder-800 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { delay: 0.5 } }}
      viewport={{ once: true }}
    >
      <p className="text-sm text-gray-500 dark:text-darkText-500">
        © {currentYear} Contest Tracker. All rights reserved.
      </p>
    </motion.div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 px-4 border-t dark:border-darkBorder-800 bg-white dark:bg-darkBox-900 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <AboutSection />
          <PlatformsSection />
          <ConnectSection />
        </motion.div>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
