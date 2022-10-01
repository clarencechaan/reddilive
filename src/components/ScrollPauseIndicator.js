import "../styles/ScrollPauseIndicator.css";
import { ArrowLineDown } from "phosphor-react";

function ScrollPauseIndicator({ scrollToBottom }) {
  return (
    <button className="ScrollPauseIndicator" onClick={scrollToBottom}>
      <ArrowLineDown size={18} weight="bold" />
      Scroll to bottom
    </button>
  );
}

export default ScrollPauseIndicator;
