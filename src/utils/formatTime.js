export function formatTotalTime(time) {
  const hours = Math.floor(time / 3600);
  let minutes = Math.floor((time % 3600) / 60);

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  return hours + "시간 " + minutes + "분";
}

export function formatLeftTime(time) {
  const hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - hours * 3600) / 60);
  let seconds = time - hours * 3600 - minutes * 60;

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return hours + "시간 " + minutes + "분 " + seconds + "초";
}
