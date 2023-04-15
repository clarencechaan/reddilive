import { getToken, getUserToken } from "./auth";

/**
 * Fetches a reddit thread given the thread ID.
 *
 * @param {string} threadId - the ID of the thread to fetch
 * @param {number} error500Count - the number of times to bypass internal server error 500
 * @returns {Promise<object>} - a Promise that resolves with the thread object
 *                              or rejects with an error
 */
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

/**
 * Fetches the logged-in user.
 *
 * @returns {Promise<string>} - a Promise that resolves with the username or
 *                              rejects with an error
 */
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

/**
 * Upvotes a reddit comment given the comment ID and upvote direction.
 *
 * @param {string} id - the ID of the comment to upvote
 * @param {number} dir - the direction of the upvote (-1 for downvote, 0 for no
 *                       vote, 1 for upvote)
 * @returns {Promise<object>} - a Promise that resolves with the result of the
 *                              upvote or rejects with an error
 */
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

/**
 * Submits a new reddit comment given the parent fullname and markdown text.
 *
 * @param {string} parent - the fullname of the parent comment or thread to reply to
 * @param {string} text - the markdown text of the comment to submit
 * @returns {Promise<object>} - a Promise that resolves with the submitted
 *                              comment object or rejects with an error
 */
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

/**
 * Fetches a list of active threads from Reddit API.
 *
 * @returns {object[]} An array of active threads.
 */
async function fetchActiveThreads() {
  const url1 = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=day&limit=100`;
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

    let map = {};

    if (resObj1?.data?.children)
      resObj1.data.children.forEach((child) => {
        map[child.data.id] = child;
      });

    if (resObj2?.data?.children)
      resObj2.data.children.forEach((child) => {
        map[child.data.id] = child;
      });

    let active = [];
    for (const id in map) active.push(map[id]);

    active = active.filter(
      (thread) =>
        thread.data.subreddit_subscribers > 100000 &&
        thread.data.num_comments /
          ((Date.now() / 1000 - thread.data.created) / 60) >=
          10
    );
    active.sort((a, b) => (a.data.created > b.data.created ? -1 : 1));
    active = active.slice(0, 8);
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
