import "../styles/Navigator.css";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

function Navigator() {
  const navigate = useNavigate();
  const errorMsgRef = useRef(null);

  function handleNavigatorSubmitted(e) {
    e.preventDefault();
    const text = e.target[0].value;
    const idx = text.indexOf("/comments/");

    let textId = "";
    if (idx >= 0) {
      textId = text.substring(idx + 10, idx + 16);
    } else {
      textId = text;
    }

    if (
      textId.length !== 6 ||
      !textId
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

    e.target.reset();
    navigate(`/comments/${textId}`);
  }

  function flashErrorMsg() {
    errorMsgRef.current.classList.remove("flash-in");
    setTimeout(() => {
      errorMsgRef.current.classList.add("flash-in");
    }, 1);
  }

  return (
    <form className="Navigator" onSubmit={handleNavigatorSubmitted}>
      <input type="text" placeholder="thread ID or URL" />
      <button className="go-btn">GO</button>
      <label className="error-msg" ref={errorMsgRef}>
        That ID or URL is invalid!
      </label>
    </form>
  );
}

export default Navigator;
