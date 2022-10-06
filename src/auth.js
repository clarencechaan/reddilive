import { v4 as uuidv4 } from "uuid";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;

const url = "https://www.reddit.com/api/v1/access_token";

let token;
let userToken;

async function getToken() {
  try {
    if (localStorage.getItem("refresh_token")) return getUserToken();
    else return token || (await fetchToken());
  } catch (error) {
    console.log("error", error);
  }
}

async function fetchToken() {
  const grantType = "https://oauth.reddit.com/grants/installed_client";
  let deviceId = localStorage.getItem("device_id");

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

async function getUserToken() {
  try {
    return userToken || (await refreshUserToken());
  } catch (error) {
    console.log("error", error);
  }
}

async function fetchUserTokens(code, redirect_uri) {
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
}

async function refreshUserToken() {
  const grantType = "refresh_token";
  const refreshToken = localStorage.getItem("refresh_token");

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
}

export { getToken, getUserToken, fetchUserTokens };
