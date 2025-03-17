import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import useStore from "../../zustand/useStore.store";
import ls from "localstorage-slim";
import Navbar from "./Navbar";
import Footer from "./Footer";

type Config = {
  theme: string;
};

const Layout = ({ children }: { children: ReactNode }) => {
  const { currentTheme, setCurrentTheme } = useStore();

  useEffect(() => {
    const config = (ls.get("contestTrackerConfig") as Config) || {
      theme: "light",
    };

    if (config.theme !== currentTheme) {
      setCurrentTheme(config.theme);
    }
  }, []);

  useEffect(() => {
    ls.set("contestTrackerConfig", { theme: currentTheme });
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
      <Toaster
        position="top-right"
        reverseOrder
        containerStyle={{
          top: 50,
          left: 20,
          bottom: 20,
          right: 20,
        }}
      />
      <Navbar />
      <main className="flex flex-col w-full h-auto gap-2 pb-4 mx-auto overflow-visible md:gap-4 max-w-7xl">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
