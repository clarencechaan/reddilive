import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navigator.css";

/**
 * Component for a form with a text input and a button for navigating to a Reddit thread.
 */
function Navigator() {
  const navigate = useNavigate();
  const errorMsgRef = useRef(null);

  /**
   * Parses the user input and navigates to the corresponding thread if it exists.
   *
   * @param {object} e - The form submit event object
   */
  function handleNavigatorSubmit(e) {
    e.preventDefault();
    const text = e.target.children[0].value;
    let threadId = "";

    // Parse input for thread ID
    if (text.includes("/comments/")) {
      const idx = text.indexOf("/comments/");
      threadId = text.substring(idx + 10);
      threadId = threadId.substring(
        0,
        threadId.indexOf("/") !== -1 ? threadId.indexOf("/") : threadId.length
      );
    } else if (text.includes("redd.it/")) {
      const idx = text.indexOf("redd.it/");
      threadId = text.substring(idx + 8);
      threadId = threadId.substring(
        0,
        threadId.indexOf("/") !== -1 ? threadId.indexOf("/") : threadId.length
      );
    } else {
      threadId = text;
    }

    // Flash error message and return if ID is invalid
    if (
      !threadId
        .split("")
        .every(
          (char) =>
            (char >= "A" && char <= "Z") ||
            (char >= "a" && char <= "z") ||
            (char >= "0" && char <= "9")
        )
    ) {
      flashErrorMsg();
      return;
    }

    // Navigate to thread of parsed ID
    e.target.reset();
    e.target.children[0].blur();
    navigate(`/comments/${threadId}`);
  }

  /**
   * Displays the error message on screen by adding a CSS class to the corresponding element.
   */
  function flashErrorMsg() {
    errorMsgRef.current.classList.remove("flash-in");
    setTimeout(() => {
      errorMsgRef.current.classList.add("flash-in");
    }, 1);
  }

  return (
    <form className="Navigator" onSubmit={handleNavigatorSubmit}>
      <input type="text" placeholder="thread URL or ID" enterKeyHint="go" />
      <button className="go-btn">GO</button>
      <label className="error-msg" ref={errorMsgRef}>
        That URL or ID is invalid!
      </label>
    </form>
  );
}

export default Navigator;
