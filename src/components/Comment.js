import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/scripts";

function Comment({ comment }) {
  return (
    <div className="Comment">
      <div className="info">
        <a href="" className="author">
          {comment.data.author}
        </a>
        <div className="timestamp">{getTimeAgo(comment.data.created)}</div>
      </div>
      <div className="body">{comment.data.body}</div>
    </div>
  );
}

export default Comment;
