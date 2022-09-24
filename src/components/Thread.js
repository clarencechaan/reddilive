import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import "../styles/Thread.css";
import { formatBody, formatFlair } from "../scripts/markdown";
import { getTimeAgo } from "../scripts/timeConversion";
import { ArrowUp, Chat as ChatIcon } from "phosphor-react";

function Thread() {
  const [comments, setComments] = useState([]);
  const [thread, setThread] = useState(null);
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
    const fetchedComments = fetchedThread[1].data.children;

    setThread(fetchedThread[0].data.children[0]);
    setComments(
      fetchedComments
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse()
    );
    console.log(fetchedThread[0].data.children[0]);
  }

  const selftext = formatBody(thread?.data.selftext);
  let flair = formatFlair(
    thread?.data.author_flair_text,
    thread?.data.author_flair_richtext
  );
  if (flair) flair = <label className="flair">{flair}</label>;

  return (
    <div className="Thread">
      <div className="sidebar">
        <div className="info-box">
          <div className="title-bar">
            <div className="by-line">
              Posted by {flair} <a href="">u/{thread?.data.author}</a>{" "}
              {getTimeAgo(thread?.data.created, { long: true })}
            </div>
            <div className="title">{thread?.data.title}</div>
          </div>
          <div className="selftext">{selftext}</div>
          <div className="stats">
            <label className="badge">
              <ArrowUp size={16} className="icon" />
              123
            </label>
            <a href="" className="badge">
              <ChatIcon size={16} className="icon" />
              456
            </a>
          </div>
        </div>
      </div>
      <Chat comments={comments} />
    </div>
  );
}

export default Thread;
