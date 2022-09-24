function getTimeAgo(date) {
  const dateObj = new Date(date * 1000 + 9000);
  const seconds = Math.floor(Date.now() / 1000 - dateObj / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let resultStr = "";

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

  return resultStr;
}

export { getTimeAgo };
