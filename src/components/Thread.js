import { useEffect, useState } from "react";
import { fetchThread } from "../api";
import Comment from "./Comment";
import "../styles/Thread.css";

function Thread() {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    refreshComments();
  }, []);

  async function refreshComments() {
    const fetchedComments = (await fetchThread())[1].data.children;
    setComments(fetchedComments.reverse());
    console.log(fetchedComments);
  }

  return (
    <div className="Thread">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.data.id} />
      ))}
    </div>
  );
}

export default Thread;
