const Snudown = require("snudown-js");
const parse = require("html-react-parser");

function formatBody(text, mediaDict) {
  let body = text || "";
  body = deentitize(body);
  body = Snudown.markdown(body);

  // emotes
  if (mediaDict)
    for (const key in mediaDict) {
      body = body.replaceAll(
        `![img](${key})`,
        `<img className="media" src="${mediaDict[key].s.u}" />`
      );
    }

  body = body.replace(/href=".*?\"/g, (match) => {
    const url = match.split(`href="`)[1].split(`"`)[0];
    return isUrlRelative(url) ? `href="https://www.reddit.com${url}"` : match;
  });

  body = parse(body);
  return body;
}

function formatFlair(text, emojiDict) {
  if (!text) return null;

  let flair = text;
  for (const emoji of emojiDict) {
    flair = flair.replaceAll(
      emoji.a,
      `<img className="flair-emoji" src="${emoji.u}"/>`
    );
  }

  flair = parse(flair);
  return flair;
}

function deentitize(str) {
  let ret = str.replace(/&gt;/g, ">");
  ret = ret.replace(/&lt;/g, "<");
  ret = ret.replace(/&quot;/g, '"');
  ret = ret.replace(/&apos;/g, "'");
  ret = ret.replace(/&amp;/g, "&");
  return ret;
}

function isUrlRelative(url) {
  return !(url.indexOf("://") > 0 || url.indexOf("//") === 0);
}

export { formatBody, formatFlair, deentitize };
