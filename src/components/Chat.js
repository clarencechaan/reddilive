import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "../styles/Chat.css";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

function Chat({ thread, setThread, delay }) {
  const comments = thread.comments;
  const [now, setNow] = useState(Date.now());

  // set up clock to calculate time since post or comment creation
  // ticking every second
  useEffect(() => {
    const nowInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(nowInterval);
    };
  }, []);

  // set comment in thread state by comment ID
  function setComment(id, cb) {
    setThread((prevThread) => {
      let resultThread = cloneDeep(prevThread);
      const idx = resultThread.comments.findIndex(
        (comment) => comment.data.id === id
      );
      resultThread.comments[idx] =
        typeof cb === "function" ? cb(resultThread.comments[idx]) : cb;
      return resultThread;
    });
  }

  return (
    <div className="Chat">
      {comments.length ? (
        <ScrollToBottom
          className="chat-box"
          followButtonClassName="follow-btn"
          initialScrollBehavior="auto"
          checkInterval={17}
        >
          {comments.map((comment) => (
            <Comment
              comment={comment}
              key={comment.data.id}
              delay={delay}
              now={now}
              setComment={(cb) => {
                setComment(comment.data.id, cb);
              }}
            />
          ))}
        </ScrollToBottom>
      ) : null}
      <CommentForm
        parentFullname={`t3_${thread?.info?.id}`}
        setThread={setThread}
        delay={delay}
        now={now}
      />
    </div>
  );
}

export default Chat;
