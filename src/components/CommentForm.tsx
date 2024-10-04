import { cloneDeep } from "lodash";
import React, { useContext, useRef } from "react";
import UserContext from "../context/UserContext";
import "../styles/CommentForm.css";
import { submitComment } from "../utils/redditAPI";
import { getSecondsAgo } from "../utils/timeConversion";

/**
 * Component for submitting comments to a Reddit thread.
 *
 * @param {string} parentFullname - The unique identifier of the parent thread.
 * @param {function} setThread - A function to set the state of the parent
 *                               thread if the comment is successfully
 *                               submitted.
 * @param {function} setComment - A function to set the state of the current
 *                                comment if the comment is successfully
 *                                submitted.
 * @param {string} parentAuthor - The username of the author of the parent thread.
 * @param {number} delay - The delay before comments are visible, in seconds.
 * @param {number} now - The current time.
 */
function CommentForm({
  parentFullname,
  setThread,
  setComment,
  parentAuthor,
  delay,
  now,
}) {
  const { user } = useContext(UserContext);
  const commentFormRef = useRef(null);

  /**
   * Attempts to submit the comment to the Reddit thread and update the state of
   * the parent thread or the current comment if successful.
   *
   * @param {object} e - The event object.
   */
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
          let idx = result.comments.findLastIndex(
            (c) =>
              getSecondsAgo(c.data.created, { now }) >= delay ||
              user === c.data.author
          );
          result.comments = [
            ...result.comments.slice(0, idx + 1),
            comment,
            ...result.comments.slice(idx + 1),
          ];
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

  /**
   * Resizes the text input based on the content height.
   *
   * @param {object} textInput - The text input element.
   */
  function resizeTextInput(textInput) {
    textInput.style.minHeight = "0px";
    textInput.style.minHeight =
      Math.min(textInput.scrollHeight + 2, 129) + "px";
  }

  /**
   * Resizes the input when the user types.
   *
   * @param {object} e - The event object.
   */
  function handleTextInputChanged(e) {
    resizeTextInput(e.target);
  }

  /**
   * Submits comment to reddit when Enter key is pressed.
   *
   * @param {object} e - The event object.
   */
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
