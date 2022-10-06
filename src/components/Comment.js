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
  const [likes, setLikes] = useState(comment.data.likes);

  if (comment.data.author === "Hydro2010") console.log(comment.data.likes);

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

  function handleUpvoteClicked() {
    setLikes((prev) => {
      const result = prev === true ? null : true;
      const dir = result == true ? 1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  }

  function handleDownvoteClicked() {
    setLikes((prev) => {
      const result = prev === false ? null : false;
      const dir = result == false ? -1 : 0;
      upvoteComment(`t1_${comment.data.id}`, dir);
      return result;
    });
  }

  const score = user ? (
    <label
      className={
        "score" +
        (likes === true ? " upvoted" : "") +
        (likes === false ? " downvoted" : "")
      }
    >
      <button className="upvote" onClick={handleUpvoteClicked}>
        <ArrowUp size={14} weight="bold" />
      </button>
      <span className="num">
        {comment.data.score +
          (likes === true ? 1 : 0) +
          (likes === false ? -1 : 0)}
      </span>
      {user ? (
        <button className="downvote" onClick={handleDownvoteClicked}>
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

  return getSecondsAgo(comment.data.created, { now }) <= delay ? null : (
    <div className="Comment">
      <div className="bubble">
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
          {flair}
          {user ? (
            <button className="reply-btn">
              <ChatsCircle size={14} weight="fill" />
            </button>
          ) : null}
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
  );
}

export default Comment;
