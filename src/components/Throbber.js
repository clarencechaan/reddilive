import React from "react";
import "../styles/Throbber.css";

/**
 * Component for a throbber animation consisting of eight blocks.
 */
function Throbber() {
  return (
    <div className="Throbber">
      <div className="block">
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
        <div className="item"></div>
      </div>
    </div>
  );
}

export default Throbber;
