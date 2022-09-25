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

  body = body.replace(/(?<=href=").*?(?=")/g, (match) => {
    return isValidUrl(match) ? match : "https://www.reddit.com" + match;
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

function isValidUrl(urlString) {
  let urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
}

export { formatBody, formatFlair };
