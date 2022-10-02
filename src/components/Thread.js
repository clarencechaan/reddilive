import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import Throbber from "./Throbber";
import Sidebar from "./Sidebar";
import "../styles/Thread.css";
import { deentitize } from "../scripts/markdown";

function Thread() {
  const [thread, setThread] = useState({
    info: null,
    stickied: null,
    comments: [],
  });
  const { threadId } = useParams();
  const [loading, setLoading] = useState(false);
  let refreshing = true;
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

  function setRefreshing(bool) {
    refreshing = bool;
    if (refreshing) {
      refreshThread();
    }
  }

  async function refreshThread(options) {
    if (!refreshing) return;
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

  return (
    <div className="Thread">
      <Sidebar thread={thread} />
      <div className="main">
        <Chat comments={thread.comments} setRefreshing={setRefreshing} />
        {loading ? <Throbber /> : null}
        {!thread.comments.length && !loading ? (
          <div className="no-comments-msg">No comments found.</div>
        ) : null}
      </div>
    </div>
  );
}

export default Thread;
