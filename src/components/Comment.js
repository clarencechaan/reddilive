import { cloneDeep } from "lodash";
import { ArrowUp, ArrowDown, ChatsCircle } from "phosphor-react";
import React, { useRef, useContext, useState } from "react";
import UserContext from "../context/UserContext";
import "../styles/Comment.css";
import { formatBody, formatFlair } from "../utils/markdown";
import { upvoteComment } from "../utils/redditAPI";
import { getTimeAgo, getSecondsAgo } from "../utils/timeConversion";
import CommentForm from "./CommentForm";

function Comment({ comment, delay, now, setComment }) {
  const repliesRef = useRef(null);
  const { user } = useContext(UserContext);
  const [likes, setLikes] = useState({ val: comment.data.likes, offset: 0 });
  const [showCommentForm, setShowCommentForm] = useState(false);

  // get array of the comment's replies, discarding MoreChildren objects
  const replies =
    comment.data.replies?.data?.children.filter(
      (comment) => comment.kind !== "more"
    ) || [];

  // get comment body, formatted from markdown to JSX with emotes and gifs
  const body = (
    <div className="body">
      {formatBody(comment.data.body, comment.data.media_metadata)}
    </div>
  );

  // get user flair, formatted from markdown to JSX with emojis
  const flair = comment.data.author_flair_text ? (
    <label className="flair">
      {formatFlair(
        comment.data.author_flair_text,
        comment.data.author_flair_richtext
      )}
    </label>
  ) : null;

  // show/hide (expand/collapse) comment replies
  function toggleRepliesCollapse() {
    repliesRef.current.classList.toggle("collapsed");
  }

  // update comment state to reflect upvote then submit upvote to reddit
  function handleUpvoteClick() {
    setLikes((prev) => {
      let result = cloneDeep(prev);
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
  }

  // update comment state to reflect downvote then submit upvote to reddit
  function handleDownvoteClick() {
    setLikes((prev) => {
      let result = cloneDeep(prev);
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
  }

  // show/hide reply input when reply button is clicked
  function handleReplyBtnClick() {
    setShowCommentForm((prev) => !prev);
  }

  // display score only if comment has not been deleted
  // upvote/downvote buttons are disabled if user is not logged in
  let score =
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

  // set reply (child comment) in comment state by reply ID
  function setChildComment(id, cb) {
    setComment((prevComment) => {
      let resultComment = cloneDeep(prevComment);
      const idx = resultComment.data.replies.data.children.findIndex(
        (reply) => reply.data.id === id
      );
      resultComment.data.replies.data.children[idx] =
        typeof cb === "function"
          ? cb(resultComment.data.replies.data.children[idx])
          : cb;
      return resultComment;
    });
  }

  // count the number of replies of any depth
  function getChildrenCount(
    replies = comment.data.replies?.data?.children || []
  ) {
    const count = replies.filter(
      (reply) =>
        getSecondsAgo(reply.data.created, { now }) > delay ||
        user === reply.data.author
    ).length;
    if (!count) return 0;
    return (
      count +
      replies.reduce(
        (sum, reply) =>
          getChildrenCount(reply.data.replies?.data?.children || []) + sum,
        0
      )
    );
  }

  // show comment only when it is old enough (i.e., reached the delay threshold)
  // or when the comment author is the user
  return getSecondsAgo(comment.data.created, { now }) > delay ||
    user === comment.data.author ? (
    <div className={"Comment" + (showCommentForm ? " show-children" : "")}>
      <div
        className={"bubble" + (user === comment.data.author ? " is-me" : "")}
      >
        <div className="info">
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
      <div className="replies-container" ref={repliesRef}>
        <div className="replies">
          {showCommentForm ? (
            <CommentForm
              parentFullname={`t1_${comment.data.id}`}
              setComment={setComment}
              parentAuthor={comment.data.author}
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
}

export default Comment;
