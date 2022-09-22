import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/scripts";
import { ArrowUp } from "phosphor-react";

function Comment({ comment }) {
  return (
    <div className={"Comment" + (comment.is_new ? " new" : "")}>
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
        <div className="timestamp">{getTimeAgo(comment.data.created)}</div>
      </div>
      <div className="body">{comment.data.body}</div>
    </div>
  );
}

export default Comment;
