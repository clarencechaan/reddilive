/**
 * Module for managing Reddit API tokens.
 */

import { v4 as uuidv4 } from "uuid";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;
const url = "https://www.reddit.com/api/v1/access_token";

let token: string;
let userToken: string;

/**
 * Returns the user access token if the user is logged in, or the general access
 * token otherwise.
 *
 * @returns {Promise<string>} - The access token.
 */
const getToken = async () => {
  try {
    if (localStorage.getItem("refresh_token")) return getUserToken();
    else return token || (await fetchToken());
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Fetches a new general access token.
 *
 * @returns {Promise<string>} - The access token.
 */
async function fetchToken() {
  const grantType = "https://oauth.reddit.com/grants/installed_client";
  let deviceId = localStorage.getItem("device_id") ?? "";

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("device_id", deviceId);
  }

  const form = new URLSearchParams({
    grant_type: grantType,
    device_id: deviceId,
  }).toString();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${window.btoa(decodeURI(CLIENT_ID + ":" + ""))}`,
      },
      body: form,
    });

    token = (await res.json()).access_token;
    return token;
  } catch (error) {
    console.log("error", error);
  }
}

/**
 * Returns the user access token if it has been previously fetched, or fetches a
 * new one.
 *
 * @returns {Promise<string>} - The user access token.
 */
async function getUserToken() {
  try {
    return userToken || (await refreshUserToken());
  } catch (error) {
    console.log("error", error);
  }
}

/**
 * Fetches the user access and refresh tokens using an authorization code.
 *
 * @param {string} code - The authorization code.
 * @param {string} redirect_uri - The redirect URI.
 * @returns {Promise<object>} - An object containing the user access token and
 *                              refresh token.
 */
const fetchUserTokens = async (code: string, redirect_uri: string) => {
  const grantType = "authorization_code";

  const form = new URLSearchParams({
    grant_type: grantType,
    code,
    redirect_uri,
  }).toString();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${window.btoa(decodeURI(CLIENT_ID + ":" + ""))}`,
      },
      body: form,
    });

    const resObj = await res.json();
    userToken = resObj.access_token;
    const refreshToken = resObj.refresh_token;
    return { userToken, refreshToken };
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * Refreshes the user access token using the refresh token saved in local storage.
 *
 * @returns {Promise<string>} - The refreshed user access token.
 */
const refreshUserToken = async () => {
  const grantType = "refresh_token";
  const refreshToken = localStorage.getItem("refresh_token") ?? "";

  const form = new URLSearchParams({
    grant_type: grantType,
    refresh_token: refreshToken,
  }).toString();

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${window.btoa(decodeURI(CLIENT_ID + ":" + ""))}`,
      },
      body: form,
    });

    userToken = (await res.json()).access_token;

    return userToken;
  } catch (error) {
    console.log("error", error);
  }
};

export { getToken, getUserToken, fetchUserTokens };
