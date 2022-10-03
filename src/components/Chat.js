import "../styles/Chat.css";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import ScrollPauseIndicator from "./ScrollPauseIndicator";
import { useRef } from "react";

function Chat({ comments, refreshing, setRefreshing, delay }) {
  const chatRef = useRef(null);
  const anchorRef = useRef(null);

  useEffect(() => {
    const unobserveAnchor = observeAnchor();
    return unobserveAnchor;
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
    <div className="Chat" ref={chatRef}>
      <div id="scroller">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.data.id} delay={delay} />
        ))}
        <div id="anchor" ref={anchorRef}></div>
      </div>
      {refreshing ? null : (
        <ScrollPauseIndicator scrollToBottom={scrollToBottom} />
      )}
    </div>
  );
}

export default Chat;
