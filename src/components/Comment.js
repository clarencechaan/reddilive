import "../styles/Comment.css";

function Comment({ comment }) {
  return (
    <div className="Comment">
      <a href="" className="author">
        {comment.data.author}
      </a>
      <div className="body">{comment.data.body}</div>
    </div>
  );
}

export default Comment;
