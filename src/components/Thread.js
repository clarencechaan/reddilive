import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import "../styles/Thread.css";
import { formatBody, formatFlair, deentitize } from "../scripts/markdown";
import { getTimeAgo } from "../scripts/timeConversion";
import { ArrowUp, Chat as ChatIcon } from "phosphor-react";
import logo from "../images/logo_small.png";

function Thread() {
  const [comments, setComments] = useState([]);
  const [thread, setThread] = useState(null);
  const [stickied, setStickied] = useState(null);
  const { threadId } = useParams();

  useEffect(() => {
    // refresh comments every 10 seconds
    refreshThread();
    const refreshInterval = setInterval(refreshThread, 2000);

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  async function refreshThread() {
    const fetchedThread = await fetchThread(threadId);
    const fetchedComments = fetchedThread[1].data.children
      .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
      .reverse();

    setThread(fetchedThread[0].data.children[0]);
    setComments((prev) => {
      let result = [...prev];
      for (const comment of fetchedComments) {
        const idx = result.findIndex((p) => p.data.id === comment.data.id);
        if (idx >= 0) result[idx] = comment;
        else result.push(comment);
      }
      return result;
    });
    setStickied(fetchedComments.find((comment) => comment.data.stickied));

    document.title =
      "reddilive | " + deentitize(fetchedThread[0].data.children[0].data.title);
  }

  const selftext = formatBody(thread?.data.selftext);
  let flair = thread?.data.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        thread?.data.author_flair_text,
        thread?.data.author_flair_richtext
      )}
    </label>
  ) : null;

  const linkFlair = thread?.data.link_flair_text ? (
    <label className="link-flair">
      {formatFlair(
        thread.data.link_flair_text,
        thread.data.link_flair_richtext
      )}
    </label>
  ) : null;

  const stickiedBox = stickied ? (
    <div className="stickied">
      <div className="by-line">
        <a
          href={`https://www.reddit.com/user/${stickied.data.author}`}
          className="author"
        >
          u/{stickied.data.author}
        </a>{" "}
        · <label className="indicator">Stickied comment</label>
        <a
          href={`https://reddit.com${stickied.data.permalink}`}
          className="timestamp"
        >
          {getTimeAgo(stickied.data.created)}{" "}
        </a>
      </div>
      <div className="body">{formatBody(stickied.data.body)}</div>
    </div>
  ) : null;

  const infoBox = thread ? (
    <div className="info-box">
      <div className="title-bar">
        <div className="by-line">
          Posted by {flair}{" "}
          <a href={`https://www.reddit.com/user/${thread.data.author}`}>
            u/{thread.data.author}
          </a>{" "}
          {getTimeAgo(thread.data.created, { long: true })}
          <span>in </span>
          <a
            href={`https://www.reddit.com/r/${thread.data.subreddit}`}
            className="subreddit"
          >
            r/{thread.data.subreddit}
          </a>
        </div>
        <a
          href={`https://www.reddit.com${thread.data.permalink}`}
          className="title"
        >
          {deentitize(thread.data.title)}
        </a>
        {linkFlair}
      </div>
      <div className="selftext">{selftext}</div>
      <div className="stats">
        <label className="badge">
          <ArrowUp size={16} className="icon" />
          {thread.data.score}
        </label>
        <a
          href={`https://www.reddit.com${thread.data.permalink}`}
          className="badge"
        >
          <ChatIcon size={16} className="icon" />
          {thread.data.num_comments}
        </a>
      </div>
    </div>
  ) : null;

  return (
    <div className="Thread">
      <div className="sidebar">
        <div className="top-bar">
          <a className="logo" href="/">
            <img className="logo" src={logo} alt="" />
          </a>
        </div>
        {infoBox}
        {stickiedBox}
      </div>
      <Chat comments={comments} />
    </div>
  );
}

export default Thread;
