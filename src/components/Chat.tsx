import { cloneDeep } from "lodash";
import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import "../styles/Chat.css";
import Comment from "./Comment";
import CommentForm from "./CommentForm";

/**
 * Component that displays a chat box containing comments of a Reddit thread and
 * a form to submit new comments. Uses React-Scroll-To-Bottom to automatically
 * scroll to the latest comment when new comments are added.
 *
 * @param {object} thread - The Reddit thread object containing thread
 *                          information and an array of comment objects.
 * @param {function} setThread - A function to update the thread state.
 * @param {number} delay - The delay in seconds between refreshing the comments of the thread.
 */
function Chat({ thread, setThread, delay }) {
  // Extract comments from thread object
  const comments = thread.comments;

  // Initialize the 'now' state variable to the current time
  const [now, setNow] = useState(Date.now());

  // Update the 'now' state variable every second to update the time elapsed
  // since the creation of comments.
  useEffect(() => {
    const nowInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(nowInterval);
    };
  }, []);

  /**
   * Updates the state of a comment in the thread object by comment ID.
   *
   * @param {string} id - The ID of the comment to update.
   * @param {function|object} cb - A callback function or an object to update the comment.
   */
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
