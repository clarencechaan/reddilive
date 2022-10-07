import "../styles/Chat.css";
import { useEffect, useState, useContext, useRef } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import UserContext from "../UserContext";
import { submitComment } from "../api";

function Chat({ thread, setThread, refreshing, setRefreshing, delay }) {
  const comments = thread.comments;
  const chatRef = useRef(null);
  const anchorRef = useRef(null);
  const [now, setNow] = useState(Date.now());
  const { user } = useContext(UserContext);
  let nowInterval;

  useEffect(() => {
    const unobserveAnchor = observeAnchor();
    return unobserveAnchor;
  }, []);

  useEffect(() => {
    if (!refreshing) return clearInterval(nowInterval);
    nowInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(nowInterval);
    };
  }, [refreshing]);

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

  async function handleCommentFormSubmit(e) {
    e.preventDefault();
    const parent = `t3_${thread.info.id}`;
    const text = e.target[0].value;
    if (!text) return;
    e.target[0].disabled = true;
    try {
      const comment = await submitComment(parent, text);
      if (comment)
        setThread((prev) => {
          let result = { ...prev };
          result.comments = [...result.comments, comment];
          return result;
        });
      e.target[0].disabled = false;
      e.target.reset();
    } catch (error) {}
  }

  return (
    <div className="Chat">
      <form
        action=""
        className="comment-form"
        onSubmit={handleCommentFormSubmit}
      >
        {user ? (
          <input type="text" placeholder="Write a comment..." />
        ) : (
          <input type="text" placeholder="Log in to comment..." disabled />
        )}
      </form>
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
