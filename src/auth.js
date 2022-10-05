import { v4 as uuidv4 } from "uuid";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;

let token;

async function fetchToken() {
  if (token) return token;

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

function getDeviceIdLocalStorage() {
  return localStorage.getItem("device_id");
}

function setDeviceIdLocalStorage(deviceId) {
  localStorage.setItem("device_id", deviceId);
}

export { fetchToken };
