import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/timeConversion";
import { ArrowUp } from "phosphor-react";
import { formatBody, formatFlair } from "../scripts/markdown";

function Comment({ comment }) {
  const replies =
    comment.data.replies?.data?.children.filter(
      (comment) => comment.kind !== "more"
    ) || [];

  const body = (
    <div className="body">
      {formatBody(comment.data.body, comment.data.mediaDict)}
    </div>
  );
  const flair = (
    <div className="flair">
      {formatFlair(
        comment.data.author_flair_text,
        comment.data.author_flair_richtext
      )}
    </div>
  );

  return (
    <div className="Comment">
      <div className="bubble">
        <div className="info">
          <a
            href={`https://www.reddit.com/user/${comment.data.author}`}
            className="author"
          >
            {comment.data.author}
          </a>
          <div className="score">
            <ArrowUp size={14} weight="bold" />
            {comment.data.score}
          </div>
          {flair}
          <div className="timestamp">{getTimeAgo(comment.data.created)}</div>
        </div>
        {body}
      </div>
      {replies.length ? (
        <div className="replies-container">
          <div className="connector" />
          <div className="replies">
            {replies.map((reply) => (
              <Comment comment={reply} key={reply.data.id} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Comment;
