"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type {
  DiaryWidget as DiaryWidgetInstance,
} from "@/types/widgetTypes";

type Props = {
  widget: DiaryWidgetInstance;
  onChange: (widget: DiaryWidgetInstance) => void;
};

export default function DiaryWidget({
  widget,
  onChange,
}: Props) {
  // 現在選択されている日付のEntryを取得
  const entry = widget.entries.find(
    (entry) => entry.date === widget.selectedDate
  );

  // Entryの中からTextBlockを取得
  const textBlock = entry?.blocks.find(
    (block) => block.type === "text"
  );

  // Tiptap
  const editor = useEditor({
    extensions: [StarterKit],

    // 現在の日付に対応するTextBlockがあればその内容を表示
    // なければ空のドキュメントを表示
    content: textBlock?.content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    immediatelyRender: false,

    // ユーザーがTiptapを編集したとき
    onUpdate: ({ editor }) => {
      const content = editor.getJSON();

      // 現在の日付のEntryを探す
      const existingEntry = widget.entries.find(
        (entry) => entry.date === widget.selectedDate
      );

      // Entryがまだ存在しない場合
      if (!existingEntry) {
        const newEntry = {
          id: crypto.randomUUID(),
          date: widget.selectedDate,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "text" as const,
              content,
            },
          ],
        };

        onChange({
          ...widget,
          entries: [
            ...widget.entries,
            newEntry,
          ],
        });

        return;
      }

      // 既存EntryのTextBlockを更新
      const updatedBlocks = existingEntry.blocks.map(
        (block) =>
          block.type === "text"
            ? {
                ...block,
                content,
              }
            : block
      );

      onChange({
        ...widget,
        entries: widget.entries.map((entry) =>
          entry.id === existingEntry.id
            ? {
                ...entry,
                blocks: updatedBlocks,
              }
            : entry
        ),
      });
    },
  });

  // selectedDateが変わったとき、
  // その日付のEntryをTiptapに表示する
  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setContent(
      textBlock?.content ?? {
        type: "doc",
        content: [
          {
            type: "paragraph",
          },
        ],
      },
      {
        // 表示内容の変更ではonUpdateを発火させない
        emitUpdate: false,
      }
    );
  }, [editor, widget.selectedDate, textBlock]);

  // 日付変更
  function changeDate(amount: number) {
    const current = new Date(widget.selectedDate);

    current.setDate(
      current.getDate() + amount
    );

    const nextDate =
      current.getFullYear() +
      "-" +
      String(current.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(current.getDate()).padStart(2, "0");

    onChange({
      ...widget,
      selectedDate: nextDate,
    });
  }

  // 日付表示用
  function formatDate(dateString: string) {
    const date = new Date(
      `${dateString}T00:00:00`
    );

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const weekdays = [
      "日",
      "月",
      "火",
      "水",
      "木",
      "金",
      "土",
    ];

    return `${year}/${month}/${day} (${weekdays[date.getDay()]})`;
  }

  return (
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col overflow-hidden bg-yellow-50 p-2">

      {/* タイトル */}
      <div className="mb-2 shrink-0 text-sm font-bold">
        📒 日記
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
          📅 {formatDate(widget.selectedDate)}
        </div>

        <button
          type="button"
          onClick={() => changeDate(1)}
          className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-yellow-100"
        >
          →
        </button>

      </div>

      {/* Tiptap */}
      <EditorContent
        editor={editor}
        className="min-h-0 flex-1 overflow-y-auto text-xs text-gray-700 outline-none"
      />

    </div>
  );
}