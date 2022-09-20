import { v4 as uuidv4 } from "uuid";

const { REACT_APP_CLIENT_ID: CLIENT_ID, REACT_APP_USER_AGENT: USER_AGENT } =
  process.env;

async function fetchToken() {
  const url = "https://www.reddit.com/api/v1/access_token";
  const grantType = "https://oauth.reddit.com/grants/installed_client";
  let deviceId = getDeviceIdLocalStorage();

  if (!deviceId) {
    deviceId = uuidv4();
    setDeviceIdLocalStorage(deviceId);
  }

  const form = new URLSearchParams({
    grant_type: grantType,
    device_id: deviceId,
  }).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      Authorization: `Basic ${window.btoa(decodeURI(CLIENT_ID + ":" + ""))}`,
    },
    body: form,
  });

  const token = (await res.json()).access_token;
  return token;
}

function getDeviceIdLocalStorage() {
  return localStorage.getItem("deviceId");
}

function setDeviceIdLocalStorage(deviceId) {
  localStorage.setItem("deviceId", deviceId);
}

export { fetchToken };
