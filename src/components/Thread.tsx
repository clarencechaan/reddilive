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

/**
 * Component for displaying a Reddit thread with live updating comments.
 */
function Thread() {
  // Initialize the thread state with an empty thread
  const [thread, setThread] = useState({
    info: null,
    stickied: null,
    comments: [],
  });

  // Get the thread ID from the URL parameter
  const { threadId } = useParams();

  // Initialize the loading state to false and the delay state to the value
  // stored in localStorage or 5 seconds if no value is stored
  const [loading, setLoading] = useState(false);
  const [delay, setDelay] = useState(
    parseInt(localStorage.getItem("delay")) || 5
  );

  // Initialize the error500Count variable to track the number of 500 errors
  let error500Count = 0;

  // Initialize a thread object with an empty state, and fetch the thread with
  // the given ID if it exists, then set the thread state.
  useEffect(() => {
    async function initiateThread() {
      setThread({
        info: null,
        stickied: null,
        comments: [],
      });

      setLoading(true);
      // Refresh the thread with the given ID.
      await refreshThread({ initiate: true });
      setLoading(false);
    }

    initiateThread();
  }, [threadId]);

  // Set up an interval to refresh a thread based on the specified delay.
  // The interval is cleared and created whenever the thread ID or delay changes.
  useEffect(() => {
    let refreshInterval;

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

  /**
   * Refreshes the thread by fetching the latest thread comments from Reddit's API.
   *
   * @param {object} [options] - Optional configuration options.
   * @param {boolean} [options.initiate] - If true, the thread state will be
   *                                       updated regardless of whether the
   *                                       state thread ID and fetched thread
   *                                       ID match.
   */
  async function refreshThread(options) {
    try {
      let fetchedThread = await fetchThread(threadId, error500Count);
      if (!fetchedThread) return;
      while (fetchedThread?.error === 500) {
        error500Count++;
        fetchedThread = await fetchThread(threadId, error500Count);
      }

      // Get array of the thread's comments, discarding MoreChildren objects and stickied comment
      const fetchedComments = fetchedThread[1].data.children
        .filter((comment) => comment.kind !== "more" && !comment.data.stickied)
        .reverse()
        .slice(-100);

      setThread((prev) => {
        // Do not update thread state if "initiate" flag is not passed,
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

        /**
         * Replaces the score and replies of a comment with the corresponding
         * values from a fetched comment object.
         *
         * @param {object} comment - The original comment object.
         * @param {object} fetchedComment - The fetched comment object containing
         *                                  the new score and replies.
         * @returns {object} - A new comment object with the updated score and replies.
         */
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
        // Update old comments and add newly fetched comments
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

  /**
   * Adds a delay to the current delay value.
   *
   * @param {number} val - The value to add to the current delay.
   */
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
    <div className="Thread">
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
