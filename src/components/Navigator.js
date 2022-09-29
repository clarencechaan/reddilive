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

    if (text.includes("/comments/")) {
      const idx = text.indexOf("/comments/");
      textId = text.substring(idx + 10, idx + 16);
    } else if (text.includes("redd.it/")) {
      const idx = text.indexOf("redd.it/");
      textId = text.substring(idx + 8, idx + 14);
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
      <input type="text" placeholder="thread URL or ID" />
      <button className="go-btn">GO</button>
      <label className="error-msg" ref={errorMsgRef}>
        That URL or ID is invalid!
      </label>
    </form>
  );
}

export default Navigator;
