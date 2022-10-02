import "../styles/Sidebar.css";
import Navigator from "./Navigator";
import logo from "../images/logo_small.png";
import fullUrl from "../images/full_url.png";
import replacedUrl from "../images/replaced_url.png";
import fullUrlDark from "../images/full_url_dark.png";
import replacedUrlDark from "../images/replaced_url_dark.png";
import arrow from "../images/arrow.png";
import { formatBody, formatFlair, deentitize } from "../scripts/markdown";
import { getTimeAgo } from "../scripts/timeConversion";
import { ArrowUp, Chat as ChatIcon } from "phosphor-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

function Sidebar({ thread }) {
  const sidebarRef = useRef(null);

  const selftext = formatBody(
    thread?.info?.selftext,
    thread?.info?.media_metadata
  );

  let flair = thread?.info?.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        thread.info.author_flair_text,
        thread.info.author_flair_richtext
      )}
    </label>
  ) : null;

  const linkFlair = thread?.info?.link_flair_text ? (
    <label className="link-flair">
      {formatFlair(
        thread.info.link_flair_text,
        thread.info.link_flair_richtext
      )}
    </label>
  ) : null;

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

  const sidebarContent = thread ? (
    <>
      {infoBox}
      {stickiedBox}
      {thread.error ? (
        <div className="not-found-msg">
          Something went wrong!
          <br />
          No thread by that ID was found.
        </div>
      ) : null}
    </>
  ) : (
    <>
      <div className="how-to-1">
        <div className="msg">Copy the reddit thread URL to the box above</div>
        <img src={arrow} className="arrow" alt="" />
      </div>
      <img src={fullUrl} className="url" alt="" />
      <img src={fullUrlDark} className="url dark" alt="" />
      <div className="how-to-2">
        <div className="msg">
          <div className="big">OR</div>
          Replace "reddit" from the URL with "reddilive"
        </div>
      </div>
      <img src={replacedUrl} className="url" alt="" />
      <img src={replacedUrlDark} className="url dark" alt="" />
    </>
  );

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
            <Link to="/" className="logo">
              <img src={logo} alt="" />
            </Link>
            <Navigator />
          </div>
          {sidebarContent}
        </div>
        <button className="collapser" onClick={toggleCollapse}>
          <span>• • • • • • • • •</span>
        </button>
      </div>
      <div className="overlay" onClick={toggleCollapse}></div>
    </div>
  );
}

export default Sidebar;
