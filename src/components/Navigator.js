import "../styles/Navigator.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function Navigator() {
  const navigate = useNavigate();
  const errorMsgRef = useRef(null);

  // read thread ID or URL from input, then navigate to thread if found
  function handleNavigatorSubmit(e) {
    e.preventDefault();
    const text = e.target[0].value;
    let threadId = "";

    // parse input for thread ID
    if (text.includes("/comments/")) {
      const idx = text.indexOf("/comments/");
      threadId = text.substring(idx + 10, idx + 16);
    } else if (text.includes("redd.it/")) {
      const idx = text.indexOf("redd.it/");
      threadId = text.substring(idx + 8, idx + 14);
    } else {
      threadId = text;
    }

    // flash error message and return if ID is invalid
    if (
      threadId.length !== 6 ||
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

    // navigate to thread of parsed ID
    e.target.reset();
    e.target[0].blur();
    navigate(`/comments/${threadId}`);
  }

  // display error message on screen
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
