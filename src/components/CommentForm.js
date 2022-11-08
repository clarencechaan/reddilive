import { cloneDeep } from "lodash";
import React, { useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import "../styles/CommentForm.css";
import { submitComment } from "../utils/redditAPI";

function CommentForm({ parentFullname, setThread, setComment, parentAuthor }) {
  const { user } = useContext(UserContext);
  const commentFormRef = useRef(null);

  // attempt to submit comment to reddit thread and update thread state if successful
  async function handleCommentFormSubmit(e) {
    e.preventDefault();
    const parent = parentFullname;
    const text = e.target[0].value;
    if (!text) return;
    e.target[0].disabled = true;
    try {
      const comment = await submitComment(parent, text);
      if (comment && setThread)
        setThread((prev) => {
          let result = cloneDeep(prev);
          result.comments = [...result.comments, comment];
          return result;
        });
      else if (comment && setComment)
        setComment((prev) => {
          let result = cloneDeep(prev);
          if (!result.data.replies)
            result.data.replies = { data: { children: [comment] } };
          else
            result.data.replies.data.children = [
              ...result.data.replies.data.children,
              comment,
            ];
          return result;
        });
      e.target[0].disabled = false;
      e.target[0].style.minHeight = "12px";
      e.target.reset();
    } catch (error) {
      console.log("error", error);
    }
  }

  // update height of text input based on content height
  function resizeTextInput(textInput) {
    textInput.style.minHeight = "0px";
    textInput.style.minHeight =
      Math.min(textInput.scrollHeight + 2, 129) + "px";
  }

  // resize input when user types
  function handleTextInputChanged(e) {
    resizeTextInput(e.target);
  }

  // submit comment to reddit when Enter key is pressed
  function onEnterPress(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
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
    <form
      action=""
      className="CommentForm"
      onSubmit={handleCommentFormSubmit}
      ref={commentFormRef}
    >
      {user ? (
        <textarea
          type="text"
          placeholder={
            parentAuthor ? `Reply to ${parentAuthor}...` : "Write a comment..."
          }
          onKeyDown={onEnterPress}
          onChange={handleTextInputChanged}
          maxLength={10000}
          enterKeyHint="send"
        />
      ) : (
        <textarea
          type="text"
          placeholder={
            parentAuthor
              ? `Log in to reply to ${parentAuthor}... `
              : "Log in to comment..."
          }
          disabled
        />
      )}
    </form>
  );
}

export default CommentForm;
