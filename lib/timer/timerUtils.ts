// lib/timer/timerUtils.ts


/* =========================
   日付文字列
========================= */
export function getDateString(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


/* =========================
   時間表示
========================= */
export function formatDuration(
  milliseconds: number
) {
  const totalSeconds =
    Math.floor(milliseconds / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  if (hours > 0) {
    return `${hours}時間 ${minutes}分 ${seconds}秒`;
  }

  if (minutes > 0) {
    return `${minutes}分 ${seconds}秒`;
  }

  return `${seconds}秒`;
}

/* =========================
   デジタル表示
========================= */
export function formatDigitalTime(
  milliseconds: number
) {
  const totalSeconds =
    Math.floor(milliseconds / 1000);

  const hours =
    Math.floor(totalSeconds / 3600);

  const minutes =
    Math.floor(
      (totalSeconds % 3600) / 60
    );

  const seconds =
    totalSeconds % 60;

  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );
}