import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { fetchUserTokens } from "../utils/auth";
import { fetchMe } from "../utils/redditAPI";
import Home from "./Home";

function Auth() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // set localStorage and state with user login details
    async function login(code) {
      try {
        const tokens = await fetchUserTokens(
          code,
          window.location.origin + "/auth"
        );
        const username = await fetchMe();
        if (username && tokens.refreshToken) {
          localStorage.setItem("username", username);
          localStorage.setItem("refresh_token", tokens.refreshToken);
          setUser(username);
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    // handle oauth redirect
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const state = JSON.parse(params.get("state"));
    const code = params.get("code");
    const threadId = state?.threadId;

    if (code) {
      login(code);
    }

    // redirect back to thread or home
    if (threadId) navigate(`/comments/${threadId}`);
    else navigate("/");
  }, []);

  return <Home />;
}

export default Auth;
