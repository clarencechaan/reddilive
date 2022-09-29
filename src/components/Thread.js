import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import Navigator from "./Navigator";
import Throbber from "./Throbber";
import "../styles/Thread.css";
import { formatBody, formatFlair, deentitize } from "../scripts/markdown";
import { getTimeAgo } from "../scripts/timeConversion";
import { ArrowUp, Chat as ChatIcon } from "phosphor-react";
import logo from "../images/logo_small.png";

function Thread() {
  const [thread, setThread] = useState({
    info: null,
    stickied: null,
    comments: [],
  });
  const { threadId } = useParams();
  const [loading, setLoading] = useState(false);
  let refreshInterval;

  useEffect(() => {
    setThread({
      info: null,
      stickied: null,
      comments: [],
    });

    // refresh thread every few seconds
    refreshThread({ initiate: true });
    clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshThread, 2000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [threadId]);

  async function refreshThread(options) {
    if (options?.initiate) setLoading(true);

    try {
      const fetchedThread = await fetchThread(threadId);
      const fetchedComments = fetchedThread[1].data.children
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse();

      setThread((prev) => {
        if (
          !options?.initiate &&
          prev.info?.id !== fetchedThread[0].data.children[0].data.id
        )
          return prev;

        let result = { ...prev };
        result.info = fetchedThread[0].data.children[0].data;
        result.stickied = fetchedThread[1].data.children.find(
          (comment) => comment.data.stickied
        )?.data;

        for (const comment of fetchedComments) {
          const idx = result.comments.findIndex(
            (p) => p.data.id === comment.data.id
          );
          if (idx >= 0) result.comments[idx] = comment;
          else result.comments.push(comment);
        }

        return result;
      });

      document.title =
        "reddilive | " +
        deentitize(fetchedThread[0].data.children[0].data.title);
    } catch (error) {
      setThread({
        info: null,
        stickied: null,
        comments: [],
        error: true,
      });
      console.log(error);
    }

    if (options?.initiate) setLoading(false);
  }

  const selftext = formatBody(
    thread.info?.selftext,
    thread.info?.media_metadata
  );
  let flair = thread.info?.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        thread.info.author_flair_text,
        thread.info.author_flair_richtext
      )}
    </label>
  ) : null;

  const linkFlair = thread.info?.link_flair_text ? (
    <label className="link-flair">
      {formatFlair(
        thread.info.link_flair_text,
        thread.info.link_flair_richtext
      )}
    </label>
  ) : null;

  const stickiedBox = thread.stickied ? (
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

  const infoBox = thread.info ? (
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
        <a
          href={`https://www.reddit.com${thread.info.permalink}`}
          className="title"
        >
          {deentitize(thread.info.title)}
        </a>
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
      </div>
    </div>
  ) : null;

  return (
    <div className="Thread">
      <div className="sidebar">
        <div className="top-bar">
          <Link to="/">
            <img className="logo" src={logo} alt="" />
          </Link>
          <Navigator />
        </div>
        {infoBox}
        {stickiedBox}
        {thread.error ? (
          <div className="not-found-msg">
            Something went wrong!
            <br />
            No thread by that ID was found.
          </div>
        ) : null}
      </div>
      <div className="main">
        <Chat comments={thread.comments} />
        {loading ? <Throbber /> : null}
        {!thread.comments.length && !loading ? (
          <div className="no-comments-msg">No comments found.</div>
        ) : null}
      </div>
    </div>
  );
}

export default Thread;
