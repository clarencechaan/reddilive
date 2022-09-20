import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = "2U-i0PX91TLFyc58_Jddbw";

async function fetchToken() {
  const url = "https://www.reddit.com/api/v1/access_token";
  const grantType = "https://oauth.reddit.com/grants/installed_client";
  const userAgent =
    "web:github.com/clarencechaan/live-reddit:reddilive:v1.0.0 (by /u/newreligionv2)";
  let deviceId = getDeviceIdLocalStorage();

  if (!deviceId) {
    deviceId = uuidv4();
    setDeviceIdLocalStorage(deviceId);
  }

  const form = new URLSearchParams({
    grant_type: grantType,
    device_id: deviceId,
    redirect_uri: "http://localhost:3000/",
  }).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
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
