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

  // curl -X POST -d 'grant_type=https://oauth.reddit.com/grants/installed_client'
  // -d 'device_id=5e5d4d1a-5a33-4234-8e4d-dc8c6a4b33c2'
  // --user-agent "web:github.com/clarencechaan/live-reddit:reddilive:v1.0.0 (by /u/newreligionv2)"
  // --user '2U-i0PX91TLFyc58_Jddbw:' https://www.reddit.com/api/v1/access_token

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
      Authorization: `Basic 2U-i0PX91TLFyc58_Jddbw:`,
    },
    body: form,
  });
}

function getDeviceIdLocalStorage() {
  return localStorage.getItem("deviceId");
}

function setDeviceIdLocalStorage(deviceId) {
  localStorage.setItem("deviceId", deviceId);
}

export { fetchToken };
