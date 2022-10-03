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
  const [delay, setDelay] = useState(
    parseInt(localStorage.getItem("delay")) || 0
  );
  const [refreshing, setRefreshing] = useState(true);
  let refreshInterval;

  useEffect(() => {
    async function initiateThread() {
      setThread({
        info: null,
        stickied: null,
        comments: [],
      });

      setLoading(true);
      await refreshThread({ initiate: true });
      setLoading(false);
    }

    // initiate thread and create refresh interval
    initiateThread();
    const clearRefreshInterval = startRefreshInterval();
    return clearRefreshInterval;
  }, [threadId]);

  useEffect(() => {
    if (!refreshing) return clearInterval(refreshInterval);
    refreshThread();
    const clearRefreshInterval = startRefreshInterval();
    return clearRefreshInterval;
  }, [refreshing]);

  function startRefreshInterval() {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshThread, 2000);

    return () => {
      clearInterval(refreshInterval);
    };
  }

  async function refreshThread(options) {
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
  }

  function addDelay(val) {
    setDelay((prev) => {
      let newDelay;
      if (prev + val > 90) newDelay = 90;
      else if (prev + val < 0) newDelay = 0;
      else newDelay = prev + val;

      localStorage.setItem("delay", newDelay);
      return newDelay;
    });
  }

  return (
    <div className="Thread">
      <Sidebar thread={thread} />
      <div className="main">
        <Chat
          comments={thread.comments}
          setRefreshing={setRefreshing}
          delay={delay}
        />
        {loading ? <Throbber /> : null}
        {!thread.comments.length && !loading ? (
          <div className="no-comments-msg">No comments found.</div>
        ) : null}
      </div>
      <div className="delay-rocker">
        <button className="add5" onClick={() => addDelay(5)}>
          +
        </button>
        <label className="seconds">{delay}s</label>
        <button className="sub5" onClick={() => addDelay(-5)}>
          -
        </button>
      </div>
    </div>
  );
}

export default Thread;
