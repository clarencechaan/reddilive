import "../styles/Chat.css";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import { useRef } from "react";

function Chat({ comments }) {
  const [pauseIndicatorVisible, setPauseIndicatorVisible] = useState(false);
  const chatRef = useRef(null);

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

    observer.observe(document.querySelector("#anchor"));

    return () => observer.unobserve(document.querySelector("#anchor"));
  }

  function scrollToBottom() {
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  }

  return (
    <div className="Chat" ref={chatRef}>
      <div id="scroller">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.data.id} />
        ))}
        <div id="anchor"></div>
      </div>
      {pauseIndicatorVisible ? (
        <ScrollPauseIndicator scrollToBottom={scrollToBottom} />
      ) : null}
    </div>
  );
}

export default Chat;
