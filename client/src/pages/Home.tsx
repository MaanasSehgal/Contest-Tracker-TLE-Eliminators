import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Code, 
  Laptop, 
  Award,
  ArrowRight
} from 'lucide-react';
import useStore from '../zustand/useStore.store';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const currentTheme = useStore((state) => state.currentTheme);
  
  const purpleNeon = "text-purple-500";
  const purpleNeonShadow = currentTheme === 'dark' 
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
      transition: { type: "spring", stiffness: 400 }
    },
    tap: { scale: 0.95 }
  };

  const PlatformIcon = ({ name }: { name: string }) => {
    switch (name) {
      case "Codeforces":
        return <Code className="w-8 h-8" />;
      case "LeetCode":
        return <Laptop className="w-8 h-8" />;
      case "CodeChef":
        return <Award className="w-8 h-8" />;
      default:
        return <Code className="w-8 h-8" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      <motion.div 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1 flex justify-center items-center md:justify-normal md:items-start flex-col"
            variants={itemVariants}
          >
            <motion.h1 
              className="text-4xl text-center md:text-left sm:text-5xl md:text-6xl font-bold text-gray-800 dark:text-darkText-300 mb-6 leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Never miss a <span className={purpleNeon}>contest</span> again
            </motion.h1>
            
            <motion.p 
              className="text-xl text-center sm:text-left text-gray-600 dark:text-darkText-400 mb-8"
              variants={itemVariants}
            >
              Track competitive programming contests across multiple platforms in one place. Stay updated with upcoming contests from Codeforces, LeetCode, CodeChef, and more.
            </motion.p>
            
            <motion.div className="hidden sm:flex flex-wrap gap-4 mb-8">
              {["Codeforces", "LeetCode", "CodeChef"].map((platform) => (
                <motion.div 
                  key={platform}
                  className="flex items-center bg-white dark:bg-darkBox-850 px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-darkBorder-800"
                  whileHover={{ 
                    y: -2,
                    boxShadow: purpleNeonShadow
                  }}
                >
                  <span className={`${purpleNeon} mr-2`}>
                    <PlatformIcon name={platform} />
                  </span>
                  <span className="text-gray-800 dark:text-darkText-300">{platform}</span>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.button
              onClick={() => navigate('/contest-tracker')}
              className="px-6 py-2 bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800  text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span>Explore Contests</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="flex-1"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white dark:bg-darkBox-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-darkBorder-800"
              whileHover={{ 
                y: -5,
                boxShadow: purpleNeonShadow
              }}
            >
              <div className="bg-gray-50 dark:bg-darkBox-850 rounded-xl p-4 mb-4 border border-gray-100 dark:border-darkBorder-800">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-darkText-300">Upcoming Contests</h3>
                  <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full">Live</span>
                </div>
                
                {[
                  { name: "Codeforces Round #789", platform: "Codeforces", time: "Today, 19:30" },
                  { name: "LeetCode Weekly Contest", platform: "LeetCode", time: "Tomorrow, 10:30" },
                  { name: "CodeChef Starters 42", platform: "CodeChef", time: "In 2 days" }
                ].map((contest, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white dark:bg-darkBox-900 p-3 rounded-lg mb-2 border border-gray-100 dark:border-darkBorder-800 flex items-center"
                    whileHover={{ x: 5 }}
                  >
                    <div className={`${purpleNeon} mr-3`}>
                      <PlatformIcon name={contest.platform} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-darkText-300">{contest.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-darkText-500">{contest.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center">
                <motion.button
                  onClick={() => navigate('/contest-tracker')}
                  className="text-purple-600 dark:text-purple-400 font-medium flex items-center mx-auto"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>View all contests</span>
                  <ArrowRight className="ml-1 w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-20 pt-10 border-t border-gray-200 dark:border-darkBorder-800"
          variants={itemVariants}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Real-time Updates", description: "Get notified about upcoming contests" },
              {title: "Post Contest Discussion", description: "Get the video solutions for the contests" },
              { title: "Contest Reminders", description: "Set reminders for your favorite contests" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center"
                whileHover={{ y: -5 }}
              >
                <h3 className={`text-xl font-semibold ${purpleNeon} mb-2`}>{feature.title}</h3>
                <p className="text-gray-600 dark:text-darkText-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-12 text-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => navigate('/contest-tracker')}
              className="px-8 py-4 bg-purple-600 dark:bg-purple-700 hover:bg-purple-700 dark:hover:bg-purple-800  text-white rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span>Get Started Now</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
