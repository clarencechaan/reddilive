import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/scripts";
import { ArrowUp } from "phosphor-react";
const Snudown = require("snudown-js");
const parse = require("html-react-parser");

function Comment({ comment }) {
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
      <div className="body">{formatBody()}</div>
    </div>
  );
}

export default Comment;
