import "../styles/Chat.css";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";

function Chat({ comments }) {
  const [pauseIndicatorVisible, setPauseIndicatorVisible] = useState(false);

  useEffect(() => {
    const clearChatPausedObserver = chatPausedObserver();

    return clearChatPausedObserver;
  }, []);

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
    <div className="Chat">
      <div className="chat-content">
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

export default Chat;
