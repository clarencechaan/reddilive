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
    const comment = resObj.json.data.things[0];
    return comment;
  } catch (error) {
    console.log("error", error);
  }
}

export { fetchThread, fetchMe, upvoteComment, submitComment };
