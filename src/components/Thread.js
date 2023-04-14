import { cloneDeep } from "lodash";
import { GearSix, ArrowSquareOut } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Thread.css";
import { deentitize } from "../utils/markdown";
import { fetchThread } from "../utils/redditAPI";
import Chat from "./Chat";
import LogInBtn from "./LogInBtn";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import Throbber from "./Throbber";

function Thread({ popout }) {
  const [thread, setThread] = useState({
    info: null,
    stickied: null,
    comments: [],
  });
  const { threadId } = useParams();
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(
    parseInt(localStorage.getItem("delay")) || 5
  );
  let error500Count = 0;

  // set thread to an empty thread, then attempt to fetch thread by threadId
  // and set thread if found
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

    initiateThread();
  }, [threadId]);

  // update interval when thread or delay is changed
  useEffect(() => {
    let refreshInterval;

    // create/clear interval to refresh thread every period specified by delay
    function startRefreshInterval(delay) {
      clearInterval(refreshInterval);
      refreshInterval = setInterval(refreshThread, delay * 1000);

      return () => {
        clearInterval(refreshInterval);
      };
    }

    const clearRefreshInterval = startRefreshInterval(delay);
    return clearRefreshInterval;
  }, [threadId, delay]);

  // attempt to fetch thread from reddit, then set thread state if found
  // otherwise set thread to empty thread
  async function refreshThread(options) {
    try {
      let fetchedThread = await fetchThread(threadId, error500Count);
      if (!fetchedThread) return;
      while (fetchedThread?.error === 500) {
        error500Count++;
        fetchedThread = await fetchThread(threadId, error500Count);
      }

      // get array of the thread's comments, discarding MoreChildren objects and stickied comment
      const fetchedComments = fetchedThread[1].data.children
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse()
        .slice(-100);

      setThread((prev) => {
        // do not update thread state if "initiate" flag is not passed
        // and state thread ID and fetched thread ID do not match
        if (
          !options?.initiate &&
          prev.info?.id !== fetchedThread[0].data.children[0].data.id
        )
          return prev;

        let result = cloneDeep(prev);
        result.info = fetchedThread[0].data.children[0].data;
        result.stickied = fetchedThread[1].data.children.find(
          (comment) => comment.data.stickied
        )?.data;

        // replace comment in thread state while ensuring any replies to the
        // comment in the previous state that were not found in the fetched
        // response are not discarded
        function replaceComment(comment, fetchedComment) {
          let resultComment = cloneDeep(comment);
          resultComment.data.score = fetchedComment.data.score;
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
                else resultChildren = [fetchedChild, ...resultChildren];
              }
            );
            if (!resultComment.data.replies)
              resultComment.data.replies = { data: {} };
            resultComment.data.replies.data.children = resultChildren;
          }

          return resultComment;
        }

        let insertCount = 0;
        // update old comments, add newly fetched comments
        for (const comment of fetchedComments) {
          const idx = result.comments.findIndex(
            (p) => p.data.id === comment.data.id
          );
          if (idx >= 0)
            result.comments[idx] = replaceComment(
              result.comments[idx],
              comment
            );
          else {
            result.comments.push(comment);
            insertCount++;
          }
        }

        if (result.comments.length > 200)
          result.comments = result.comments.slice(insertCount + 1);

        return result;
      });

      document.title =
        deentitize(fetchedThread[0].data.children[0].data.title) +
        " - reddiLive";
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

  // increase/decrease delay in state and local storage
  function addDelay(val) {
    setDelay((prev) => {
      let newDelay;
      if (prev + val > 90) newDelay = 90;
      else if (prev + val < 5) newDelay = 5;
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
          <div className="no-comments-msg">No comments.</div>
        ) : null}
      </div>
      <div className="settings" tabIndex={-1}>
        <button className="toggle">
          <GearSix size={26} weight="fill" />
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
          <ArrowSquareOut size={22} weight="bold" />
        </button>
      </div>
      <LogInBtn threadId={threadId} />
      {loading ? <Throbber /> : null}
    </div>
  );
}

export default Thread;
