import "../styles/Chat.css";
import { useEffect, useState, useContext, useRef } from "react";
import Comment from "./Comment";
import UserContext from "../UserContext";
import { submitComment } from "../api";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ thread, setThread, delay }) {
  const comments = thread.comments;
  const [now, setNow] = useState(Date.now());
  const { user } = useContext(UserContext);
  const commentFormRef = useRef(null);

  useEffect(() => {
    const nowInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(nowInterval);
    };
  }, []);

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

  function setComment(id, cb) {
    setThread((prevThread) => {
      let resultThread = { ...prevThread };
      const idx = resultThread.comments.findIndex(
        (comment) => comment.data.id === id
      );
      resultThread.comments[idx] =
        typeof cb === "function" ? cb(resultThread.comments[idx]) : cb;
      return resultThread;
    });
  }

  function resizeTextInput(textInput) {
    textInput.style.minHeight = "0px";
    textInput.style.minHeight =
      Math.min(textInput.scrollHeight + 2, 129) + "px";
  }

  function handleTextInputChanged(e) {
    resizeTextInput(e.target);
  }

  function onEnterPress(e) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      const form = commentFormRef.current;
      if (form) {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    }
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
      <form
        action=""
        className="comment-form"
        onSubmit={handleCommentFormSubmit}
        ref={commentFormRef}
      >
        {user ? (
          <textarea
            type="text"
            placeholder="Write a comment..."
            onKeyDown={onEnterPress}
            onChange={handleTextInputChanged}
            maxLength={10000}
          />
        ) : (
          <textarea type="text" placeholder="Log in to comment..." disabled />
        )}
      </form>
    </div>
  );
}

export default Chat;
