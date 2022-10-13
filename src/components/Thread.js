import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchThread } from "../api";
import Chat from "./Chat";
import Throbber from "./Throbber";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import LogInBtn from "./LogInBtn";
import "../styles/Thread.css";
import { deentitize } from "../scripts/markdown";
import { GearSix, ArrowSquareOut } from "phosphor-react";

function Thread({ popout }) {
  const [thread, setThread] = useState({
    info: null,
    stickied: null,
    comments: [],
  });
  const { threadId } = useParams();
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(
    parseInt(localStorage.getItem("delay")) || 0
  );
  let refreshInterval;

  useEffect(() => {
    async function initiateThread() {
      setThread({
        info: null,
        stickied: null,
        comments: [],
      });

      setLoading(true);
      await refreshThread({ initiate: true });
      setLoading(false);
    }

    // initiate thread and create refresh interval
    initiateThread();
  }, [threadId]);

  useEffect(() => {
    const clearRefreshInterval = startRefreshInterval(delay);
    return clearRefreshInterval;
  }, [threadId, delay]);

  function startRefreshInterval(delay) {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(refreshThread, delay * 1000 || 2000);

    return () => {
      clearInterval(refreshInterval);
    };
  }

  async function refreshThread(options) {
    try {
      const fetchedThread = await fetchThread(threadId);
      if (!fetchedThread) return;
      const fetchedComments = fetchedThread[1].data.children
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse();

      setThread((prev) => {
        if (
          !options?.initiate &&
          prev.info?.id !== fetchedThread[0].data.children[0].data.id
        )
          return prev;

        let result = { ...prev };
        result.info = fetchedThread[0].data.children[0].data;
        result.stickied = fetchedThread[1].data.children.find(
          (comment) => comment.data.stickied
        )?.data;

        function replaceComment(comment, fetchedComment) {
          let resultComment = { ...comment };
          if (fetchedComment.data.replies) {
            let resultChildren =
              resultComment.data.replies?.data?.children || [];
            fetchedComment.data.replies.data.children.forEach(
              (fetchedChild) => {
                const idx = resultChildren.findIndex(
                  (resultChild) => resultChild.data.id === fetchedChild.data.id
                );
                if (idx >= 0)
                  resultChildren[idx] = replaceComment(
                    resultChildren[idx],
                    fetchedChild
                  );
                else resultChildren.push(fetchedChild);
              }
            );
            if (!resultComment.data.replies)
              resultComment.data.replies = { data: {} };
            resultComment.data.replies.data.children = resultChildren;
          }
          return resultComment;
        }

        for (const comment of fetchedComments) {
          const idx = result.comments.findIndex(
            (p) => p.data.id === comment.data.id
          );
          if (idx >= 0)
            result.comments[idx] = replaceComment(
              result.comments[idx],
              comment
            );
          else result.comments.push(comment);
        }

        result.comments = result.comments.slice(-200);

        return result;
      });

      document.title =
        "reddilive | " +
        deentitize(fetchedThread[0].data.children[0].data.title);
    } catch (error) {
      setThread({
        info: null,
        stickied: null,
        comments: [],
        error: true,
      });
      console.log(error);
    }
  }

  function addDelay(val) {
    setDelay((prev) => {
      let newDelay;
      if (prev + val > 90) newDelay = 90;
      else if (prev + val < 0) newDelay = 0;
      else newDelay = prev + val;

      localStorage.setItem("delay", newDelay);
      return newDelay;
    });
  }

  return (
    <div className={"Thread" + (popout ? " popout" : "")}>
      <Sidebar thread={thread} />
      <div className="main">
        <Chat thread={thread} setThread={setThread} delay={delay} />
        {!thread.comments.length && !loading ? (
          <div className="no-comments-msg">No comments found.</div>
        ) : null}
      </div>
      <div className="settings" tabIndex={-1}>
        <button className="gear">
          <GearSix size={24} weight="fill" />
        </button>
        <ThemeSwitch />
        <div className="delay-rocker">
          <button className="add5" onClick={() => addDelay(5)}>
            +
          </button>
          <label className="seconds">{delay}s</label>
          <button className="sub5" onClick={() => addDelay(-5)}>
            -
          </button>
        </div>
        <button
          className="popout-chat"
          onClick={() => {
            window.open(
              window.location.href,
              "name",
              "height=600px,width=400px"
            );
          }}
        >
          <ArrowSquareOut size={19} weight="bold" />
        </button>
      </div>
      <LogInBtn threadId={threadId} />
      {loading ? <Throbber /> : null}
    </div>
  );
}

export default Thread;
