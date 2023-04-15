import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { fetchUserTokens } from "../utils/auth";
import { fetchMe } from "../utils/redditAPI";
import Home from "./Home";

/**
 * Component that handles user authentication through OAuth 2.0.
 * The authorization code is received as a query parameter and is used to
 * retrieve access and refresh tokens from the Reddit API.
 * After obtaining the tokens, the user context is set with the user's username
 * and saves the tokens in the local storage.
 * The user is also redirected back to the thread or home page after authentication.
 */
function Auth() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    /**
     * Handles the user login flow.
     * The authorization code is used to fetch the user tokens from the Reddit
     * API and the user context is set with the username retrieved from the API.
     * The tokens are saved in the local storage.
     *
     * @param {string} code - The authorization code received as a query parameter.
     */
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

    // Handle OAuth redirect
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const state = JSON.parse(params.get("state"));
    const code = params.get("code");
    const threadId = state?.threadId;

    if (code) {
      login(code);
    }

    // Redirect back to thread or home
    if (threadId) navigate(`/comments/${threadId}`);
    else navigate("/");
  }, []);

  return <Home />;
}

export default Auth;
