import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import useStore from "./zustand/useStore.store";

import Layout from "./components/global/Layout";
import ContestTracker from "./pages/ContestTracker";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import PostContestDiscussions from "./pages/PostContestDiscussions";
import UpdateContest from "./pages/UpdateContest";

function App() {
  const { currentTheme } = useStore();

  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  return (
    <Router>
      <div className="min-h-screen transition-colors duration-300">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post-contest-discussions" element={<PostContestDiscussions />} />
            <Route path="/contest-tracker" element={<ContestTracker />} />
            <Route path="/update-contest" element={<UpdateContest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
