import { v4 as uuidv4 } from "uuid";
import { RedditThread } from "../global/types";
import { writeFileSync } from "fs";

const CLIENT_ID = "2U-i0PX91TLFyc58_Jddbw";
const URL = "https://www.reddit.com/api/v1/access_token";
let token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IlNIQTI1NjpzS3dsMnlsV0VtMjVmcXhwTU40cWY4MXE2OWFFdWFyMnpLMUdhVGxjdWNZIiwidHlwIjoiSldUIn0.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzI4ODQ3NzkyLjkwNDk3NCwiaWF0IjoxNzI4NzYxMzkyLjkwNDk3NCwianRpIjoiVkc5WGhHUkJTRFJGVmUyaGpudWNRMm5IcGVNY1lnIiwiY2lkIjoiMlUtaTBQWDkxVExGeWM1OF9KZGRidyIsImxpZCI6InQyXzMycjZ6cG40IiwiYWlkIjoidDJfMzJyNnpwbjQiLCJsY2EiOjE1NDgzNzYyMTMzOTIsInNjcCI6ImVKeUtWaXBLVFV4UjBsRXF5eTlKVmRKUktpNU55czBzVWRKUnlreEp6U3ZKTEtsVWlnVUVBQURfXzhwVUM2VSIsInJjaWQiOiJnZmJ0TElTQjc2ZUhZU3hyYllrLTRYX2ZDRzNnNnJ1bGhOcXNaTVhBUm9FIiwiZmxvIjozfQ.Ufi0EI9rH4OTBux347Ua-E6wnELXXbweq2CsPJf70eQuwS_Fr2jov4_O8omlz7nZBCCASWdsnpMdtWdmpVXZ9-Tp_hFQku4VbPFV-9mXov2oC00xMne0EYdX3hqIhKMg4fOUbSnsCN_FemmY95hin8fTxN0pjRyyQQmLyndUkdB7o6FnCimBPykXNz2iLpQ9AEtl-tOPwvzBtBJpob3IcyeM4o_ZrfctimCNlu7NoYItDYBgUEOQ_M9ItcolB0eOJyXJWLteQdwWWBZaunYNMCcF79myPAQGPz-VNEBiD4v6iXlJLZ_MICBv9kOp5he7mh3gX5OrntsPGNqGEJOJjA";

const fetchToken = async () => {
  const grantType = "https://oauth.reddit.com/grants/installed_client";
  const deviceId = uuidv4();

  const form = new URLSearchParams({
    grant_type: grantType,
    device_id: deviceId,
  }).toString();

  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(decodeURI(CLIENT_ID + ":" + ""))}`,
      },
      body: form,
    });

    return (await res.json()).access_token;
  } catch (error) {
    console.log("error", error);
  }
};

const fetchActiveThreads = async (): Promise<RedditThread[]> => {
  const url1 = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=day&limit=100`;
  const url2 = `https://oauth.reddit.com/search?q=nsfw%3Ano&sort=comments&t=hour`;

  try {
    if (!token) token = await fetchToken();
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

    const map: { [id: string]: RedditThread } = {};

    if (resObj1?.data?.children)
      resObj1.data.children.forEach((child: RedditThread) => {
        if (child.data) map[child.data.id] = child;
      });

    if (resObj2?.data?.children)
      resObj2.data.children.forEach((child: RedditThread) => {
        if (child.data) map[child.data.id] = child;
      });

    let active = [];
    for (const id in map) active.push(map[id]);

    active = active.filter(
      (thread) =>
        thread.data &&
        thread.data.subreddit_subscribers > 100000 &&
        thread.data.num_comments /
          ((Date.now() / 1000 - thread.data.created) / 60) >=
          10
    );
    active.sort((a, b) =>
      a.data && b.data && a.data.created > b.data.created ? -1 : 1
    );
    active = active.slice(0, 8);
    return active;
  } catch (error) {
    console.log("error", error);
  }

  return [];
};

const createActiveThreadsJSON = async () => {
  const activeThreads = await fetchActiveThreads();
  const str = JSON.stringify(activeThreads);

  console.log(activeThreads.length, "active threads found.");
  console.log(activeThreads.map((thread) => thread?.data?.title));

  // Create active_threads.json
  writeFileSync("./active_threads.json", str);
};

createActiveThreadsJSON();
