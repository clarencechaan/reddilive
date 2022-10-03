function getTimeAgo(date, options) {
  if (!date) return "";

  const dateObj = new Date(date * 1000 + 9000);
  const now = options?.now || Date.now();
  const seconds = Math.floor(now / 1000 - dateObj / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let resultStr = "";

  if (options?.long) {
    if (days >= 1) {
      resultStr = dateObj.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (hours > 1) {
      resultStr = hours + " hours ago";
    } else if (hours == 1) {
      resultStr = hours + " hour ago";
    } else if (minutes > 1) {
      resultStr = minutes + " minutes ago";
    } else if (minutes == 1) {
      resultStr = minutes + " minute ago";
    } else if (seconds > 1) {
      resultStr = seconds + " seconds ago";
    } else {
      resultStr = seconds + " second ago";
    }
  } else {
    if (days >= 1) {
      resultStr = dateObj.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      });
    } else if (hours >= 1) {
      resultStr = hours + "h";
    } else if (minutes >= 1) {
      resultStr = minutes + "m";
    } else {
      resultStr = seconds + "s";
    }
  }

  return resultStr;
}

function getSecondsAgo(date, options) {
  if (!date) return 0;

  const dateObj = new Date(date * 1000 + 9000);
  const now = options?.now || Date.now();
  const seconds = Math.floor(now / 1000 - dateObj / 1000);
  return seconds;
}

export { getTimeAgo, getSecondsAgo };
