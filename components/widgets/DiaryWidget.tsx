"use client";

import { useState } from "react";

type Props = {
  content: string;
  onChange: (content: string) => void;
};

export default function DiaryWidget({
  content,
  onChange,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  function changeDate(amount: number) {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + amount);
      return next;
    });
  }

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];

    return `${year}/${month}/${day} (${weekdays[date.getDay()]})`;
  }

  return (
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden bg-yellow-50 p-2">

      {/* タイトル */}
      <div className="relative mb-2 flex shrink-0 items-center">
        <div className="text-sm font-bold">
          📒 日記
        </div>
      </div>

      {/* 日付変更 */}
      <div className="mb-2 flex shrink-0 items-center justify-center gap-1">

        <button
          type="button"
          onClick={() => changeDate(-1)}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-yellow-100"
        >
          ←
        </button>

        <div className="flex h-7 items-center rounded-md px-2 text-xs font-medium">
          📅 {formatDate(selectedDate)}
        </div>

        <button
          type="button"
          onClick={() => changeDate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-yellow-100"
        >
          →
        </button>

      </div>

      {/* 日記本文 */}
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="今日の出来事を書いてみましょう"
        className="min-h-0 flex-1 resize-none overflow-y-auto bg-transparent text-xs text-gray-700 outline-none"
      />

    </div>
  );
}