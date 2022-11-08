import "../styles/Sidebar.css";
import Navigator from "./Navigator";
import logo from "../images/logo_small.png";
import fullUrl from "../images/full_url.png";
import replacedUrl from "../images/replaced_url.png";
import fullUrlDark from "../images/full_url_dark.png";
import replacedUrlDark from "../images/replaced_url_dark.png";
import arrow from "../images/arrow.png";
import github from "../images/github.png";
import { formatBody, formatFlair, deentitize } from "../utils/markdown";
import { getTimeAgo } from "../utils/timeConversion";
import { ArrowUp, Chat as ChatIcon, List } from "phosphor-react";
import { Link } from "react-router-dom";
import { useRef, useContext } from "react";
import ThemeContext from "../context/ThemeContext";

function Sidebar({ thread }) {
  const sidebarRef = useRef(null);
  const { darkMode } = useContext(ThemeContext);

  // format thread selftext from markdown to JSX with emotes and gifs
  const selftext = formatBody(
    thread?.info?.selftext,
    thread?.info?.media_metadata
  );

  // get author flair, formatted from markdown to JSX with emojis
  let flair = thread?.info?.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        thread.info.author_flair_text,
        thread.info.author_flair_richtext
      )}
    </label>
  ) : null;

  // get link flair, formatted from markdown to JSX with emojis
  const linkFlair = thread?.info?.link_flair_text ? (
    <label className="link-flair">
      {formatFlair(
        thread.info.link_flair_text,
        thread.info.link_flair_richtext
      )}
    </label>
  ) : null;

  // get stickied comment, formatted from markdown to JSX with emotes and gifs
  const stickiedBox = thread?.stickied ? (
    <div className="stickied">
      <div className="by-line">
        <a
          href={`https://www.reddit.com/user/${thread.stickied.author}`}
          className="author"
        >
          u/{thread.stickied.author}
        </a>{" "}
        · <label className="indicator">Stickied comment</label>
        <a
          href={`https://reddit.com${thread.stickied.permalink}`}
          className="timestamp"
        >
          {getTimeAgo(thread.stickied.created)}{" "}
        </a>
      </div>
      <div className="body">
        {formatBody(thread.stickied.body, thread.stickied.media_metadata)}
      </div>
    </div>
  ) : null;

  // get thread info including author, title, selftext, creation time, etc.
  // formatted from markdown to JSX with emotes and gifs
  const infoBox = thread?.info ? (
    <div className="info-box">
      <div className="title-bar">
        <div className="by-line">
          Posted by {flair}{" "}
          <a href={`https://www.reddit.com/user/${thread.info.author}`}>
            u/{thread.info.author}
          </a>{" "}
          {getTimeAgo(thread.info.created, { long: true })}
          <span>in </span>
          <a
            href={`https://www.reddit.com/r/${thread.info.subreddit}`}
            className="subreddit"
          >
            r/{thread.info.subreddit}
          </a>
        </div>
        <span onClick={toggleCollapse} className="title">
          {deentitize(thread.info.title)}
        </span>
        {linkFlair}
      </div>
      <div className="selftext">{selftext}</div>
      <div className="stats">
        <label className="badge">
          <ArrowUp size={16} className="icon" />
          {thread.info.score}
        </label>
        <a
          href={`https://www.reddit.com${thread.info.permalink}`}
          className="badge"
        >
          <ChatIcon size={16} className="icon" />
          {thread.info.num_comments}
        </a>
        <a
          href={`https://reddit.com${thread.info.permalink}`}
          className="view-on-reddit"
        >
          view on reddit
        </a>
      </div>
    </div>
  ) : null;

  // show thread info and stickied comment if thread prop is found
  // otherwise show "how to" diagram
  const sidebarContent = thread ? (
    <div className="sidebar-content">
      {infoBox}
      {stickiedBox}
      {thread.error ? (
        <div className="not-found-msg">
          Something went wrong!
          <br />
          No thread found.
        </div>
      ) : null}
      <a href="https://github.com/clarencechaan" className="me">
        by Clarence Chan
        <img src={github} className="github" alt="" />
      </a>
    </div>
  ) : (
    <div className="sidebar-content">
      <div className="how-to-1">
        <div className="msg">Copy the reddit thread URL to the box above</div>
        <img src={arrow} className="arrow" alt="" />
      </div>
      <img src={darkMode ? fullUrlDark : fullUrl} className="url" alt="" />
      <div className="how-to-2">
        <div className="msg">
          <div className="big">OR</div>
          Replace "reddit" from the URL with "reddilive"
        </div>
      </div>
      <img
        src={darkMode ? replacedUrlDark : replacedUrl}
        className="url"
        alt=""
      />
    </div>
  );

  // show/hide (expand/collapse) sidebar
  function toggleCollapse() {
    sidebarRef.current.classList.toggle("collapsed");
  }

  return (
    <div
      className={"SidebarContainer" + (thread ? " collapsed" : "")}
      ref={sidebarRef}
    >
      <div className="Sidebar">
        <div className="drawer">
          <div className="top-bar">
            <button className="collapser in-line" onClick={toggleCollapse}>
              <List size={22} weight="bold" />
            </button>
            <Link to="/" className="logo">
              <img src={logo} alt="" />
            </Link>
            <Navigator />
          </div>
          {sidebarContent}
        </div>
      </div>
      <button className="collapser floating" onClick={toggleCollapse}>
        <List size={22} weight="bold" />
      </button>
      <div className="overlay" onClick={toggleCollapse}></div>
    </div>
  );
}

export default Sidebar;
