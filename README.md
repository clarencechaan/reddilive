![reddiLive](./src/images/logo_small.png)

# reddiLive - live threads for reddit

[ReddiLive](https://reddilive.com/) is a web app that provides a chat-like UI for fast-moving reddit threads, such as live discussion and sports game threads. It is 100% free and open-source; there are no ads, no paywalled features, and no way to donate.

## Features

- Auto-refreshing thread
- Custom refresh delay from 0 to 90 seconds
- Upvoting & downvoting comments
- Submitting comments (both top-level and comment replies)
- Dark and light themes
- Popping out to a mini-window
- Responsive design for all screen sizes

## How to use it

1. Open https://reddilive.com/ and paste the URL of any reddit thread to the navigation textbox and click **"GO"**

**OR**

2. Replace `reddit` from the URL of any reddit thread with `reddilive` and navigate

**Automatically redirecting link for thread creators:**

- Link to `https://reddilive.com/redirect` in your thread selftext or comment for users to automatically redirect from the originating thread to the corresponding reddilive page
- Note: this functionality relies on reading the referrer URL and is therefore not as robust as hard linking directly, e.g., `https://reddilive.com/comments/<thread ID>`
