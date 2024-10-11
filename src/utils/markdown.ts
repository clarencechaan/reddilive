import { markdown } from "snudown-js";
import parse from "html-react-parser";
import { Emoji, MediaDict } from "../global/types";

/**
 * Converts reddit selftext/thread markdown to JSX, with optional media.
 */
const formatBody = (text: string, mediaDict?: MediaDict) => {
  let body = text || "";
  body = deentitize(body);
  body = markdown(body);

  // Emotes and gifs
  if (mediaDict)
    for (const key in mediaDict) {
      body = body.replaceAll(
        `![img](${key})`,
        `<img className="emote" src="${mediaDict[key].s.u}" />`
      );
      body = body.replaceAll(
        `![gif](${key})`,
        mediaDict[key].s.mp4
          ? `<video className="gif" src="${mediaDict[key].s.mp4}" autoplay loop muted playsinline/>`
          : `<img className="gif" src="${mediaDict[key].s.gif}" />`
      );
    }

  // Prepend relative links with https://www.reddit.com
  body = body.replace(/href=".*?"/g, (match) => {
    const url = match.split(`href="`)[1].split(`"`)[0];
    return isUrlRelative(url) ? `href="https://www.reddit.com${url}"` : match;
  });

  const jsx = parse(body);
  return jsx;
};

/**
 * Converts flair text to JSX, with optional emojis.
 */
const formatFlair = (text: string, emojiDict: Emoji[]) => {
  if (!text) return null;

  let flair = text;
  for (const emoji of emojiDict) {
    flair = flair.replaceAll(
      emoji.a,
      `<img className="flair-emoji" src="${emoji.u}"/>`
    );
  }

  const jsx = parse(flair);
  return jsx;
};

/**
 * Replaces HTML entities with characters.
 */
const deentitize = (str: string) => {
  let ret = str.replace(/&gt;/g, ">");
  ret = ret.replace(/&lt;/g, "<");
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, "&");
  return ret;
};

/**
 * Checks if URL is a relative URL.
 */
const isUrlRelative = (url: string) => {
  return !(url.indexOf("://") > 0 || url.indexOf("//") === 0);
};

export { formatBody, formatFlair, deentitize };
