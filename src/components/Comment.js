import "../styles/Comment.css";
import { getTimeAgo, getSecondsAgo } from "../scripts/timeConversion";
import { ArrowUp } from "phosphor-react";
import { formatBody, formatFlair } from "../scripts/markdown";
import { useRef } from "react";

function Comment({ comment, delay, now }) {
  const repliesRef = useRef(null);

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

          <label className="score">
            <ArrowUp size={14} weight="bold" />
            {comment.data.score}
          </label>
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
  );
}

export default Comment;
