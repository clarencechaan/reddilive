import { cloneDeep } from "lodash";
import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import "../styles/CommentForm.css";
import { submitComment } from "../utils/redditAPI";
import { getSecondsAgo } from "../utils/timeConversion";
import { RedditComment, RedditThread } from "../global/types";

interface CommentFormProps {
  parentFullname: string;
  setThread: ((cb: (prev: RedditThread) => RedditThread) => void) | null;
  setComment?: (cb: (prev: RedditComment) => RedditComment) => void;
  parentAuthor?: string;
  delay: number;
  now: number;
}

/**
 * Component for submitting comments to a Reddit thread.
 */
const CommentForm = ({
  parentFullname,
  setThread,
  setComment,
  parentAuthor,
  delay,
  now,
}: CommentFormProps) => {
  const { user } = useContext(UserContext);

  /**
   * Attempts to submit the comment to the Reddit thread and update the state of
   * the parent thread or the current comment if successful.
   */
  const handleCommentFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const parent = parentFullname;
    const form = e.target as HTMLFormElement;
    const textArea = form[0] as HTMLTextAreaElement;
    const text = textArea.value;

    if (!text) return;
    textArea.disabled = true;

    try {
      const comment = await submitComment(parent, text);
      if (comment && setThread)
        setThread((prev) => {
          const result = cloneDeep(prev);
          const idx = result.comments.findLastIndex(
            (c: RedditComment) =>
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
          const result = cloneDeep(prev);
          if (!result.data.replies)
            result.data.replies = { data: { children: [comment] } };
          else
            result.data.replies.data.children = [
              ...result.data.replies.data.children,
              comment,
            ];
          return result;
        });
      textArea.disabled = false;
      textArea.style.minHeight = "12px";
      form.reset();
    } catch (error) {
      console.log("error", error);
    }
  };

  /**
   * Resizes the text input based on the content height.
   */
  const resizeTextInput = (textArea: HTMLTextAreaElement) => {
    textArea.style.minHeight = "0px";
    textArea.style.minHeight = Math.min(textArea.scrollHeight + 2, 129) + "px";
  };

  /**
   * Resizes the input when the user types.
   */
  const handleTextInputChanged = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    resizeTextInput(e.target as HTMLTextAreaElement);
  };

  /**
   * Submits comment to reddit when Enter key is pressed.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const textArea = e.target as HTMLTextAreaElement;
      textArea.blur();
      const form = textArea.parentNode as HTMLFormElement;
      if (form) {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    }
  };

  return (
    <form action="" className="CommentForm" onSubmit={handleCommentFormSubmit}>
      {user ? (
        <textarea
          placeholder={
            parentAuthor ? `Reply to ${parentAuthor}...` : "Write a comment..."
          }
          onKeyDown={handleKeyDown}
          onChange={handleTextInputChanged}
          maxLength={10000}
          enterKeyHint="send"
        />
      ) : (
        <textarea
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
};

export default CommentForm;
