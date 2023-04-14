import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import github from "../images/github.png";
import logo from "../images/logo.png";
import "../styles/Home.css";
import LogInBtn from "./LogInBtn";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import { fetchActiveThreads } from "../utils/redditAPI";
import { getTimeAgo } from "../utils/timeConversion";

function Home() {
  const [activeThreads, setActiveThreads] = useState([]);

  useEffect(() => {
    async function getActiveThreads() {
      const threads = await fetchActiveThreads();
      if (threads) setActiveThreads(threads);
    }

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
                  {thread.data.title}
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
    </div>
  );
}

export default Home;
