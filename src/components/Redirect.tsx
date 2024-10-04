import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

/**
 * Component for redirecting the user to the thread they were previously viewing
 * or to the home page if the referrer is not valid.
 */
function Redirect() {
  const navigate = useNavigate();

  /**
   * Parses the referrer and navigates the user to the appropriate thread or to
   * the home page if the referrer is not valid.
   */
  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/comments/")) {
      // Parse referrer for thread ID
      const idx = referrer.indexOf("/comments/");
      let threadId = referrer.substring(idx + 10);
      threadId = threadId.substring(
        0,
        threadId.indexOf("/") !== 0 ? threadId.indexOf("/") : threadId.length
      );

      // Navigate to thread of parsed ID
      navigate(`/comments/${threadId}`);
    } else {
      // Navigate to home if referrer is invalid
      navigate("/");
    }
  }, []);

  return <Home />;
}

export default Redirect;
