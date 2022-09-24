import "../styles/Comment.css";
import { getTimeAgo } from "../scripts/scripts";
import { ArrowUp } from "phosphor-react";
const Snudown = require("snudown-js");
const parse = require("html-react-parser");

function Comment({ comment }) {
  const replies =
    comment.data.replies?.data?.children.filter(
      (comment) => comment.kind !== "more"
    ) || [];

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

  function formatFlair() {
    if (!comment.data.author_flair_text) return null;

    let flair = comment.data.author_flair_text;
    for (const emoji of comment.data.author_flair_richtext) {
      flair = flair.replaceAll(
        emoji.a,
        `<img className="flair-emoji" src="${emoji.u}"/>`
      );
    }

    flair = parse(flair);
    return <div className="flair">{flair}</div>;
  }

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
          {formatFlair()}
          <div className="timestamp">{getTimeAgo(comment.data.created)}</div>
        </div>
        <div className="body">{formatBody()}</div>
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
