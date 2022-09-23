import { useEffect, useState } from "react";
import { fetchThread } from "../api";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import "../styles/Thread.css";

function Thread() {
  const [comments, setComments] = useState([]);
  const [pauseIndicatorVisible, setPauseIndicatorVisible] = useState(false);

  useEffect(() => {
    // refresh comments every 10 seconds
    refreshComments();
    const refreshInterval = setInterval(refreshComments, 5000);

    const clearChatPausedObserver = chatPausedObserver();

    return () => {
      clearInterval(refreshInterval);
      clearChatPausedObserver();
    };
  }, []);

  async function refreshComments() {
    const fetchedComments = (await fetchThread())[1].data.children;
    setComments((prev) =>
      fetchedComments
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse()
    );
  }

  function chatPausedObserver() {
    let observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setPauseIndicatorVisible(false);
        else setPauseIndicatorVisible(true);
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 0,
      }
    );

    observer.observe(document.querySelector("#auto-scroll-trigger"));

    return () =>
      observer.unobserve(document.querySelector("#auto-scroll-trigger"));
  }

  function scrollToBottom() {
    document.querySelector("#auto-scroll-trigger").scrollIntoView();
  }

  return (
    <div className="Thread">
      <div className="thread-content">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.data.id} />
        ))}
        <div id="auto-scroll-trigger"></div>
      </div>
      {pauseIndicatorVisible ? (
        <ScrollPauseIndicator scrollToBottom={scrollToBottom} />
      ) : null}
    </div>
  );
}

export default Thread;
