import { getToken, getUserToken } from "./auth";

// fetch reddit thread given thread ID
// (pass error500Count to bypass internal server error 500)
async function fetchThread(threadId, error500Count = 0) {
  const url =
    `https://oauth.reddit.com/comments/${threadId}/?sort=new` +
    "&".repeat(error500Count);

  try {
    const token = await getToken();
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status === 500) return { error: 500 };
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

// retrieve the most active threads
async function fetchActiveThreads() {
  const url1 = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=day`;
  const url2 = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=hour`;

  try {
    const token = await getToken();
    const res1 = await fetch(url1, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const res2 = await fetch(url2, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const resObj1 = await res1.json();
    const resObj2 = await res2.json();
    let active = [];
    if (resObj1?.data?.children) active.push(...resObj1.data.children);
    if (resObj2?.data?.children)
      active.push(
        ...resObj2.data.children.filter(
          (thread) =>
            thread.data.num_comments /
              ((Date.now() / 1000 - thread.data.created) / 60) >=
            5
        )
      );
    active.sort((a, b) => (a.data.created > b.data.created ? -1 : 1));
    active = active.filter(
      (thread) => thread.data.subreddit_subscribers > 100000
    );
    active = active.slice(0, 5);
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
