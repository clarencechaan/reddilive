import "../styles/Comment.css";
import { getTimeAgo, getSecondsAgo } from "../scripts/timeConversion";
import { ArrowUp, ArrowDown, ChatsCircle } from "phosphor-react";
import { formatBody, formatFlair } from "../scripts/markdown";
import { useRef, useContext, useState } from "react";
import UserContext from "../UserContext";
import { upvoteComment } from "../api";

function Comment({ comment, delay, now }) {
  const repliesRef = useRef(null);
  const { user } = useContext(UserContext);
  const [likes, setLikes] = useState({ val: comment.data.likes, offset: 0 });

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

  const score =
    user && user !== comment.data.author ? (
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
        {user ? (
          <button className="downvote" onClick={handleDownvoteClick}>
            <ArrowDown size={14} weight="bold" />
          </button>
        ) : null}
      </label>
    ) : (
      <label className="score">
        <ArrowUp size={14} weight="bold" />
        {comment.data.score}
      </label>
    );

  return getSecondsAgo(comment.data.created, { now }) > delay ||
    user === comment.data.author ? (
    <div className="Comment">
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
          {user ? (
            <button className="reply-btn">
              <ChatsCircle size={14} weight="fill" />
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
      {replies.length ? (
        <div className="replies-container" ref={repliesRef}>
          <div className="replies">
            {[...replies].reverse().map((reply) => (
              <Comment comment={reply} key={reply.data.id} delay={delay} />
            ))}
          </div>
          <button className="connector" onClick={toggleRepliesCollapse} />
        </div>
      ) : null}
    </div>
  ) : null;
}

export default Comment;
