import "../styles/Chat.css";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import { useRef } from "react";

function Chat({ comments, setRefreshing }) {
  const [chatPaused, setChatPaused] = useState(false);
  const chatRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    chatPausedObserver();
  }, []);

  function chatPausedObserver() {
    let observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChatPaused(false);
          setRefreshing(true);
        } else {
          setChatPaused(true);
          setRefreshing(false);
        }
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 0,
      }
    );

    observer.observe(anchorRef.current);
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
        <div id="anchor" ref={anchorRef}></div>
      </div>
      {chatPaused ? (
        <ScrollPauseIndicator scrollToBottom={scrollToBottom} />
      ) : null}
    </div>
  );
}

export default Chat;
