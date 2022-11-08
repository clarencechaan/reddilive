import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "./Home";

function Redirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes("/comments/")) {
      // parse referrer for thread ID
      const idx = referrer.indexOf("/comments/");
      const threadId = referrer.substring(idx + 10, idx + 16);

      // navigate to thread of parsed ID
      navigate(`/comments/${threadId}`);
    } else {
      // navigate to home if referrer is invalid
      navigate("/");
    }
  }, []);

  return <Home />;
}

export default Redirect;
