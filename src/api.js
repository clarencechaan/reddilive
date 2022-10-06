import { getToken, getUserToken } from "./auth";

async function fetchThread(threadId) {
  const url = `https://oauth.reddit.com/comments/${threadId}/?sort=new`;

  try {
    const token = await getToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const thread = await res.json();
    return thread;
  } catch (error) {
    console.log("error", error);
  }
}

async function fetchMe() {
  const url = `https://oauth.reddit.com/api/v1/me`;

  try {
    const token = await getUserToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const username = (await res.json()).name;
    return username;
  } catch (error) {
    console.log("error", error);
  }
}

export { fetchThread, fetchMe };
