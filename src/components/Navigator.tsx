import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navigator.css";

/**
 * Component for a form with a text input and a button for navigating to a Reddit thread.
 */
const Navigator = () => {
  const navigate = useNavigate();
  const errorMsgRef = useRef<HTMLElement>(null);

  /**
   * Parses the user input and navigates to the corresponding thread if it exists.
   */
  const handleNavigatorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form[0] as HTMLInputElement;
    const str = input.value;
    let threadId = "";

    /**
     * Displays the error message on screen by adding a CSS class to the corresponding element.
     */
    const flashErrorMsg = () => {
      errorMsgRef.current?.classList.remove("flash-in");
      setTimeout(() => {
        errorMsgRef.current?.classList.add("flash-in");
      }, 1);
    };

    // Parse input for thread ID
    if (str.includes("/comments/")) {
      const idx = str.indexOf("/comments/");
      threadId = str.substring(idx + 10);
      threadId = threadId.substring(
        0,
        threadId.indexOf("/") !== -1 ? threadId.indexOf("/") : threadId.length
      );
    } else if (str.includes("redd.it/")) {
      const idx = str.indexOf("redd.it/");
      threadId = str.substring(idx + 8);
      threadId = threadId.substring(
        0,
        threadId.indexOf("/") !== -1 ? threadId.indexOf("/") : threadId.length
      );
    } else {
      threadId = str;
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

    form.reset();
    input.blur();

    // Navigate to thread of parsed ID
    navigate(`/comments/${threadId}`);
  };

  return (
    <form className="Navigator" onSubmit={handleNavigatorSubmit}>
      <input type="text" placeholder="thread URL or ID" enterKeyHint="go" />
      <button className="go-btn">GO</button>
      <label
        className="error-msg"
        ref={errorMsgRef as React.RefObject<HTMLLabelElement>}
      >
        That URL or ID is invalid!
      </label>
    </form>
  );
};

export default Navigator;
