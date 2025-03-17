import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-primary" />
      </motion.div>
      <p className="mt-4 text-gray-600 dark:text-darkText-400">
        Loading contests...
      </p>
    </div>
  );
};

export default LoadingState;
