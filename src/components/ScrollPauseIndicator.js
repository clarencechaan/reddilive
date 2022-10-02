import "../styles/ScrollPauseIndicator.css";
import { Pause } from "phosphor-react";

function ScrollPauseIndicator({ scrollToBottom }) {
  return (
    <button className="ScrollPauseIndicator" onClick={scrollToBottom}>
      <Pause size={18} weight="fill" />
      Chat paused due to scroll
    </button>
  );
}

export default ScrollPauseIndicator;
