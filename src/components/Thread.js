import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import "../styles/Thread.css";

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

  return (
    <div className="Thread">
      <div className="info-box">
        <div className="title">{thread?.data.title}</div>
      </div>
      <Chat comments={comments} />
    </div>
  );
}

export default Thread;
