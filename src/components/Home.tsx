import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import github from "../images/github.png";
import logo from "../images/logo.png";
import "../styles/Home.css";
import LogInBtn from "./LogInBtn";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import Throbber from "./Throbber";
import { deentitize } from "../utils/markdown";
import { fetchActiveThreads } from "../utils/redditAPI";
import { getTimeAgo } from "../utils/timeConversion";
import { RedditThread } from "../global/types";

/**
 * Component for the homepage, which displays a list of active threads from Reddit.
 */
const Home = () => {
  const [activeThreads, setActiveThreads] = useState<RedditThread[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the active threads from the Reddit API and update the state with the results.
  useEffect(() => {
    const getActiveThreads = async () => {
      setLoading(true);
      const threads = await fetchActiveThreads();
      setLoading(false);
      setActiveThreads(threads);
    };

    document.title = "reddiLive: live threads for reddit";

    getActiveThreads();
  }, []);

  return (
    <div className="Home">
      <Sidebar />
      <div className="main">
        <img src={logo} className="logo" alt="" />
        <div className="tag-line">live threads for reddit</div>
        {activeThreads.length ? (
          <div className="active-threads">
            <h1>Active Threads</h1>
            {activeThreads.map((thread) => (
              <div key={thread.data.id} className="thread">
                <Link to={`/comments/${thread.data.id}`} className="title">
                  {deentitize(thread.data.title)}
                </Link>
                <p className="subtext">{`(r/${
                  thread.data.subreddit
                }, ${getTimeAgo(thread.data.created, {
                  long: true,
                })}, ${thread.data.num_comments} comments)`}</p>
              </div>
            ))}
          </div>
        ) : null}
        <a href="https://github.com/clarencechaan" className="me">
          by Clarence Chan <img src={github} className="github" alt="" />
        </a>
      </div>
      <ThemeSwitch />
      <LogInBtn />
      {loading ? <Throbber /> : null}
    </div>
  );
};

export default Home;
