import { getToken, getUserToken } from "./auth";

// fetch reddit thread given thread ID
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

// fetch the logged in user
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

// upvote reddit comment given the comment ID and upvote direction
async function upvoteComment(id, dir) {
  const url = `https://oauth.reddit.com/api/vote`;

  const form = new URLSearchParams({
    id,
    dir,
  }).toString();

  try {
    const token = await getUserToken();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const resObj = await res.json();
    return resObj;
  } catch (error) {
    console.log("error", error);
  }
}

// submit new reddit comment given the parent fullname and markdown text
async function submitComment(parent, text) {
  const url = `https://oauth.reddit.com/api/comment`;

  const form = new URLSearchParams({
    parent,
    text,
    api_type: "json",
  }).toString();

  try {
    const token = await getUserToken();
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    const resObj = await res.json();
    const comment = resObj.json?.data?.things[0];
    return comment;
  } catch (error) {
    console.log("error", error);
  }
}

// retrieve the most active threads of the past 6 hours
async function fetchActiveThreads() {
  const url = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=day`;

  try {
    const token = await getToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resObj = await res.json();
    const active = resObj?.data?.children
      ?.filter((child) => child.data.created > Date.now() / 1000 - 6 * 60 * 60)
      .slice(0, 5);
    return active;
  } catch (error) {
    console.log("error", error);
  }
}

export {
  fetchThread,
  fetchMe,
  upvoteComment,
  submitComment,
  fetchActiveThreads,
};
