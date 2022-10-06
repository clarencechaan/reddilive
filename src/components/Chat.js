import "../styles/Chat.css";
import { useEffect, useState, useContext, useRef } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import UserContext from "../UserContext";

function Chat({ comments, refreshing, setRefreshing, delay }) {
  const chatRef = useRef(null);
  const anchorRef = useRef(null);
  const [now, setNow] = useState(Date.now());
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const nowInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    const unobserveAnchor = observeAnchor();
    return () => {
      clearInterval(nowInterval);
      unobserveAnchor();
    };
  }, []);

  function observeAnchor() {
    let observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRefreshing(true);
        else setRefreshing(false);
      },
      {
        root: null,
        rootMargin: "10px",
        threshold: 0,
      }
    );

    observer.observe(anchorRef.current);

    return () => {
      anchorRef.current && observer.unobserve(anchorRef.current);
    };
  }

  function scrollToBottom() {
    chatRef.current.scrollTo(0, chatRef.current.scrollHeight);
  }

  return (
    <div className="Chat">
      {user ? (
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
        />
      ) : (
        <input
          type="text"
          className="comment-input"
          placeholder="Log in to comment..."
          disabled
        />
      )}
      <div className="chat-box" ref={chatRef}>
        <div id="scroller">
          {comments.map((comment) => (
            <Comment
              comment={comment}
              key={comment.data.id}
              delay={delay}
              now={now}
            />
          ))}
          <div id="anchor" ref={anchorRef}></div>
        </div>
        {refreshing ? null : (
          <ScrollPauseIndicator scrollToBottom={scrollToBottom} />
        )}
      </div>
    </div>
  );
}

export default Chat;
