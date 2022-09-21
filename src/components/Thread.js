import { useEffect, useState } from "react";
import { fetchThread } from "../api";
import Comment from "./Comment";
import "../styles/Thread.css";

function Thread() {
  const [comments, setComments] = useState([]);
  let autoScroll = true;

  useEffect(() => {
    // refresh comments every 10 seconds
    refreshComments();
    const refreshInterval = setInterval(refreshComments, 2000);

    autoScrollObserver();

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  async function refreshComments() {
    const fetchedComments = (await fetchThread())[1].data.children;
    setComments(
      fetchedComments
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse()
    );
    if (autoScroll)
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 1);
  }

  function autoScrollObserver() {
    let observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) autoScroll = true;
        else autoScroll = false;
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 0,
      }
    );

    observer.observe(document.querySelector("#auto-scroll-trigger"));
  }

  return (
    <div className="Thread">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.data.id} />
      ))}
      <div id="auto-scroll-trigger"></div>
    </div>
  );
}

export default Thread;
