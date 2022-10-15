import "../styles/Comment.css";
import { getTimeAgo, getSecondsAgo } from "../scripts/timeConversion";
import { ArrowUp, ArrowDown, ChatsCircle } from "phosphor-react";
import { formatBody, formatFlair } from "../scripts/markdown";
import { useRef, useContext, useState } from "react";
import UserContext from "../UserContext";
import { upvoteComment, submitComment } from "../api";
import { useEffect } from "react";

function Comment({ comment, delay, now, setComment }) {
  const repliesRef = useRef(null);
  const { user } = useContext(UserContext);
  const [likes, setLikes] = useState({ val: comment.data.likes, offset: 0 });
  const [showReplyForm, setShowReplyForm] = useState(false);
  const replyFormRef = useRef(null);
  const replyInputRef = useRef(null);

  useEffect(() => {
    if (showReplyForm) replyInputRef.current.focus();
  }, [showReplyForm]);

  const replies =
    comment.data.replies?.data?.children.filter(
      (comment) => comment.kind !== "more"
    ) || [];

  const body = (
    <div className="body">
      {formatBody(comment.data.body, comment.data.media_metadata)}
    </div>
  );

  let flair = formatFlair(
    comment.data.author_flair_text,
    comment.data.author_flair_richtext
  );
  if (flair) flair = <label className="flair">{flair}</label>;

  function toggleRepliesCollapse() {
    repliesRef.current.classList.toggle("collapsed");
  }

  function handleUpvoteClick() {
    setLikes((prev) => {
      let result = { ...prev };
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
      const dir = result.val == true ? 1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  }

  function handleDownvoteClick() {
    setLikes((prev) => {
      let result = { ...prev };
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
      const dir = result.val == false ? -1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  }

  function handleReplyBtnClick() {
    setShowReplyForm((prev) => !prev);
  }

  async function handleReplyFormSubmit(e) {
    e.preventDefault();
    const parent = `t1_${comment.data.id}`;
    const text = e.target[0].value;
    if (!text) return;
    e.target[0].disabled = true;
    try {
      const comment = await submitComment(parent, text);
      if (comment)
        setComment((prev) => {
          let result = { ...prev };
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
      e.target.reset();
    } catch (error) {}
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
      const form = replyFormRef.current;
      if (form) {
        if (typeof form.requestSubmit === "function") {
          form.requestSubmit();
        } else {
          form.dispatchEvent(new Event("submit", { cancelable: true }));
        }
      }
    }
  }

  let score = null;
  if (comment.data.author === "[deleted]") score = null;
  else if (user && comment.data.author === user)
    score = (
      <label className="score">
        <ArrowUp size={14} weight="bold" />
        {comment.data.score}
      </label>
    );
  else if (user)
    score = (
      <label
        className={
          "score" +
          (likes.val === true ? " upvoted" : "") +
          (likes.val === false ? " downvoted" : "")
        }
      >
        <button className="upvote" onClick={handleUpvoteClick}>
          <ArrowUp size={14} weight="bold" />
        </button>
        <span className="num">
          {comment.data.score_hidden ? "" : comment.data.score + likes.offset}
        </span>
        <button className="downvote" onClick={handleDownvoteClick}>
          <ArrowDown size={14} weight="bold" />
        </button>
      </label>
    );
  else
    score = (
      <label className="score">
        <button className="upvote" disabled>
          <ArrowUp size={14} weight="bold" />
        </button>
        <span className="num">
          {comment.data.score_hidden ? "" : comment.data.score}
        </span>
      </label>
    );

  function setChildComment(id, cb) {
    setComment((prevComment) => {
      let resultComment = { ...prevComment };
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

  let replyForm = null;
  if (showReplyForm && user)
    replyForm = (
      <form
        action=""
        className="reply-form"
        onSubmit={handleReplyFormSubmit}
        ref={replyFormRef}
      >
        <textarea
          type="text"
          placeholder={`Reply to ${comment.data.author}...`}
          ref={replyInputRef}
          onKeyDown={onEnterPress}
          onChange={handleTextInputChanged}
          maxLength={10000}
        />
      </form>
    );
  else if (showReplyForm && !user)
    replyForm = (
      <form action="" className="reply-form">
        <textarea
          type="text"
          placeholder={`Log in to reply...`}
          ref={replyInputRef}
          disabled
        />
      </form>
    );

  return getSecondsAgo(comment.data.created, { now }) > delay ||
    user === comment.data.author ? (
    <div className={"Comment" + (showReplyForm ? " show-children" : "")}>
      <div
        className={"bubble" + (user === comment.data.author ? " is-me" : "")}
      >
        <div className="info">
          {comment.data.author !== "[deleted]" ? (
            <a
              href={`https://www.reddit.com/user/${comment.data.author}`}
              className="author"
            >
              {comment.data.author}
            </a>
          ) : (
            <span className="author deleted">[deleted]</span>
          )}
          {score}
          {comment.data.author !== "[deleted]" ? (
            <button className="reply-btn" onClick={handleReplyBtnClick}>
              <ChatsCircle size={14} weight="fill" />
              {(comment.data.depth === 0 && getChildrenCount()) || ""}
            </button>
          ) : null}
          {flair}
          <a
            href={`https://reddit.com${comment.data.permalink}`}
            className="timestamp"
          >
            {getTimeAgo(comment.data.created, { now })}
          </a>
        </div>
        {body}
      </div>
      <div className="replies-container" ref={repliesRef}>
        <div className="replies">
          {replyForm}
          {[...replies].reverse().map((reply) => (
            <Comment
              comment={reply}
              key={reply.data.id}
              delay={delay}
              now={now}
              setComment={(cb) => {
                setChildComment(reply.data.id, cb);
              }}
              handleTextInputChanged={handleTextInputChanged}
            />
          ))}
        </div>
        <button className="connector" onClick={toggleRepliesCollapse} />
      </div>
    </div>
  ) : null;
}

export default Comment;
