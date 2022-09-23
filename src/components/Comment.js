import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/scripts";
import { ArrowUp } from "phosphor-react";
const Snudown = require("snudown-js");
const parse = require("html-react-parser");

function Comment({ comment }) {
  const replies = comment.data.replies?.data?.children || [];

  function formatBody() {
    let body = comment.data.body;
    body = Snudown.markdown(body);

    // emotes
    const media = comment.data.media_metadata;
    if (media)
      for (const key in media) {
        body = body.replaceAll(
          `![img](${key})`,
          `<img className="media" src="${media[key].s.u}" />`
        );
      }

    body = parse(body);
    return body;
  }

  const flair = comment.data.author_flair_text ? (
    <div className="flair">{comment.data.author_flair_text}</div>
  ) : null;

  const spacer = comment.data?.depth
    ? Array(comment.data.depth)
        .fill()
        .map((level, idx) =>
          idx < comment.data.depth - 1 ? (
            <div className="spacer" />
          ) : (
            <div className="connector" />
          )
        )
    : null;

  return (
    <div className="Comment">
      <div className={"main-comment"}>
        {spacer}
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
          <div className="body">{formatBody()}</div>
        </div>
      </div>
      <div className="replies">
        {replies.map((comment) => (
          <Comment comment={comment} key={comment.data.id} />
        ))}
      </div>
    </div>
  );
}

export default Comment;
