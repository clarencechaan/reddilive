import { fetchToken } from "./auth";

async function fetchThread(threadId) {
  const url = `https://oauth.reddit.com/comments/${threadId}/?sort=new`;

  try {
    const token = await fetchToken();
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

export { fetchThread };
