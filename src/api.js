import { fetchToken } from "./auth";

const USER_AGENT = process.env.REACT_APP_USER_AGENT;

async function fetchThread() {
  const token = await fetchToken();
  const url = "https://oauth.reddit.com/comments/xkx4am/?sort=new";

  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Authorization: `Bearer ${token}`,
    },
  });

  const thread = await res.json();
  return thread;
}

export { fetchThread };
