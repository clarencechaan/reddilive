import { cloneDeep } from "lodash";
import { ArrowUp, ArrowDown, ChatsCircle } from "phosphor-react";
import React, { useRef, useContext, useState } from "react";
import UserContext from "../context/UserContext";
import "../styles/Comment.css";
import { formatBody, formatFlair } from "../utils/markdown";
import { upvoteComment } from "../utils/redditAPI";
import { getTimeAgo, getSecondsAgo } from "../utils/timeConversion";
import CommentForm from "./CommentForm";
import type { RedditComment } from "../global/types";

interface CommentProps {
  comment: RedditComment;
  delay: number;
  now: number;
  setComment: (cb: (prev: RedditComment) => RedditComment) => void;
}

/**
 * Component that displays a Reddit comment with associated controls.
 */
const Comment = ({ comment, delay, now, setComment }: CommentProps) => {
  const repliesRef = useRef<HTMLElement>(null);
  const { user } = useContext(UserContext);
  const [likes, setLikes] = useState({ val: comment.data.likes, offset: 0 });
  const [showCommentForm, setShowCommentForm] = useState(false);

  // Get array of the comment's replies, discarding MoreChildren objects
  const replies =
    comment.data.replies?.data?.children.filter(
      (comment) => comment.kind !== "more"
    ) || [];

  // Get comment body, formatted from markdown to JSX with emotes and gifs
  const body = (
    <div className="body">
      {formatBody(comment.data.body, comment.data.media_metadata)}
    </div>
  );

  // Get user flair, formatted from markdown to JSX with emojis
  const flair = comment.data.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        comment.data.author_flair_text,
        comment.data.author_flair_richtext
      )}
    </label>
  ) : null;

  /**
   * Shows/hides (expand/collapse) comment replies
   */
  const toggleRepliesCollapse = () => {
    repliesRef.current?.classList.toggle("collapsed");
  };

  /**
   * Updates comment state to reflect upvote then submit upvote to reddit
   */
  const handleUpvoteClick = () => {
    setLikes((prev) => {
      const result = cloneDeep(prev);
      if (prev.val === true) {
        result.offset = result.offset - 1;
        result.val = null;
      } else if (prev.val === null) {
        result.offset = result.offset + 1;
        result.val = true;
      } else if (prev.val === false) {
        result.offset = result.offset + 2;
        result.val = true;
      }
      const dir = result.val === true ? 1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  };

  /**
   * Updates comment state to reflect downvote then submit upvote to reddit
   */
  const handleDownvoteClick = () => {
    setLikes((prev) => {
      const result = cloneDeep(prev);
      if (prev.val === false) {
        result.offset = result.offset + 1;
        result.val = null;
      } else if (prev.val === null) {
        result.offset = result.offset - 1;
        result.val = false;
      } else if (prev.val === true) {
        result.offset = result.offset - 2;
        result.val = false;
      }
      const dir = result.val === false ? -1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  };

  /**
   * Shows/hides reply input when reply button is clicked
   */
  const handleReplyBtnClick = () => {
    setShowCommentForm((prev) => !prev);
  };

  // Display score only if comment has not been deleted
  // Upvote/downvote buttons are disabled if user is not logged in
  const score =
    comment.data.author === "[deleted]" ? null : (
      <label
        className={
          "score" +
          (likes.val === true ? " upvoted" : "") +
          (likes.val === false ? " downvoted" : "")
        }
      >
        <button className="upvote" onClick={handleUpvoteClick} disabled={!user}>
          <ArrowUp size={14} weight="bold" />
        </button>
        <span className="num">
          {comment.data.score_hidden
            ? ""
            : (comment.data.score || 0) + likes.offset}
        </span>
        <button
          className="downvote"
          onClick={handleDownvoteClick}
          disabled={!user}
        >
          <ArrowDown size={14} weight="bold" />
        </button>
      </label>
    );

  /**
   * Updates a child comment with a new value using a callback function or value.
   */
  const setChildComment = (
    id: string,
    cb: ((comment: RedditComment) => RedditComment) | RedditComment
  ) => {
    setComment((prevComment) => {
      const resultComment = cloneDeep(prevComment);
      const idx = resultComment.data.replies.data.children.findIndex(
        (reply: RedditComment) => reply.data.id === id
      );
      resultComment.data.replies.data.children[idx] =
        typeof cb === "function"
          ? cb(resultComment.data.replies.data.children[idx])
          : cb;
      return resultComment;
    });
  };

  /**
   * Recursively counts the number of child comments.
   */
  const getChildrenCount = (
    replies = comment.data.replies?.data?.children || []
  ): number => {
    const count = replies.filter(
      (reply) =>
        getSecondsAgo(reply.data.created, { now }) >= delay ||
        user === reply.data.author
    ).length;
    if (!count) return 0;
    return (
      count +
      replies.reduce(
        (sum, reply: RedditComment) =>
          getChildrenCount(reply.data.replies?.data?.children || []) + sum,
        0
      )
    );
  };

  // Show comment only when it is old enough (i.e., reached the delay
  // threshold), or when the comment author is the user
  return getSecondsAgo(comment.data.created, { now }) >= delay ||
    user === comment.data.author ? (
    <div
      className={"Comment" + (showCommentForm ? " show-children" : "")}
      data-testid={comment.data.id}
    >
      <div
        className={"bubble" + (user === comment.data.author ? " is-me" : "")}
      >
        <div className="info">
          <div className="left">
            {comment.data.author !== "[deleted]" ? (
              <a
                href={`https://www.reddit.com/user/${comment.data.author}`}
                className="author"
                onClick={(e) => {
                  !window.confirm("Go to reddit?") && e.preventDefault();
                }}
              >
                {comment.data.author}
              </a>
            ) : (
              <span className="author deleted">[deleted]</span>
            )}
            {score}
            {comment.data.author !== "[deleted]" ? (
              <button className="reply-btn" onClick={handleReplyBtnClick}>
                {comment.data.depth === 0 && getChildrenCount() ? (
                  <>
                    <ChatsCircle size={14} weight="fill" /> {getChildrenCount()}
                  </>
                ) : (
                  <ChatsCircle size={14} />
                )}
              </button>
            ) : null}
            {flair}
          </div>
          <a
            href={`https://reddit.com${comment.data.permalink}`}
            className="timestamp"
            onClick={(e) => {
              !window.confirm("Go to reddit?") && e.preventDefault();
            }}
          >
            {getTimeAgo(comment.data.created, { now })}
          </a>
        </div>
        {body}
      </div>
      <div
        className="replies-container"
        ref={repliesRef as React.RefObject<HTMLDivElement>}
      >
        <div className="replies">
          {showCommentForm ? (
            <CommentForm
              parentFullname={`t1_${comment.data.id}`}
              setThread={null}
              setComment={setComment}
              parentAuthor={comment.data.author}
              delay={delay}
              now={now}
            />
          ) : null}
          {[...replies].reverse().map((reply) => (
            <Comment
              comment={reply}
              key={reply.data.id}
              delay={delay}
              now={now}
              setComment={(cb) => {
                setChildComment(reply.data.id, cb);
              }}
            />
          ))}
        </div>
        <button className="connector" onClick={toggleRepliesCollapse} />
      </div>
    </div>
  ) : null;
};

export default Comment;
