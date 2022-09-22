import "../styles/ScrollPauseIndicator.css";
import { Pause } from "phosphor-react";

function ScrollPauseIndicator({ scrollToBottom }) {
  return (
    <div className="ScrollPauseIndicator" onClick={scrollToBottom}>
      <Pause size={18} weight="fill" />
      Chat paused due to scroll
    </div>
  );
}

export default ScrollPauseIndicator;
