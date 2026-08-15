"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Placeholder from "@tiptap/extension-placeholder";
import type {
  DiaryWidget as DiaryWidgetInstance,
  DiaryEntry,
} from "@/types/widgetTypes";

type Props = {
  widget: DiaryWidgetInstance;
  diaryEntries: DiaryEntry[];
  onChange: (widget: DiaryWidgetInstance) => void;
  onDiaryChange: (entries: DiaryEntry[]) => void;
};

export default function DiaryWidget({
  widget,
  diaryEntries,
  onChange,
  onDiaryChange,
}: Props) {
  // =========================
  // 最新の値を保持
  // =========================

  const widgetRef = useRef(widget);
  const diaryEntriesRef = useRef(diaryEntries);

  useEffect(() => {
    widgetRef.current = widget;
  }, [widget]);

  useEffect(() => {
    diaryEntriesRef.current = diaryEntries;
  }, [diaryEntries]);

  // =========================
  // 現在の日付のEntryを取得
  // =========================

  const entry = diaryEntries.find(
    (entry) => entry.date === widget.selectedDate
  );

  // =========================
  // Entryの中からTextBlockを取得
  // =========================

  const textBlock = entry?.blocks.find(
    (block) => block.type === "text"
  );

  // =========================
  // Tiptap
  // =========================

  const editor = useEditor({
    extensions: [
      StarterKit,

      TaskList,

      TaskItem.configure({
        nested: true,
      }),

      Placeholder.configure({
        placeholder: "今日の出来事を書いてみましょう",
      }),
    ],

    // IMEやブラウザによるスペルチェックを無効化
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },

    // =========================
    // 初期表示
    // =========================

    content: textBlock?.content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },

    immediatelyRender: false,

    // =========================
    // 内容が変更されたとき
    // =========================

    onUpdate: ({ editor }) => {
      // 日本語入力の変換中は保存しない
      if (editor.isComposing) {
        return;
      }

      const content = editor.getJSON();

      // 最新の値を取得
      const currentWidget = widgetRef.current;
      const currentEntries = diaryEntriesRef.current;

      // 現在の日付のEntryを探す
      const existingEntry = currentEntries.find(
        (entry) =>
          entry.date === currentWidget.selectedDate
      );

      // =========================
      // Entryがまだ存在しない場合
      // =========================

      if (!existingEntry) {
        const newEntry: DiaryEntry = {
          id: crypto.randomUUID(),
          date: currentWidget.selectedDate,
          blocks: [
            {
              id: crypto.randomUUID(),
              type: "text",
              content,
            },
          ],
        };

        onDiaryChange([
          ...currentEntries,
          newEntry,
        ]);

        return;
      }

      // =========================
      // 既存EntryのTextBlockを更新
      // =========================

      const updatedBlocks = existingEntry.blocks.map(
        (block) =>
          block.type === "text"
            ? {
              ...block,
              content,
            }
            : block
      );

      const updatedEntries = currentEntries.map(
        (entry) =>
          entry.id === existingEntry.id
            ? {
              ...entry,
              blocks: updatedBlocks,
            }
            : entry
      );

      onDiaryChange(updatedEntries);
    },
  });

  // =========================
  // selectedDateが変わったとき
  // =========================

  useEffect(() => {
    if (!editor) {
      return;
    }

    const entry = diaryEntries.find(
      (entry) => entry.date === widget.selectedDate
    );

    const textBlock = entry?.blocks.find(
      (block) => block.type === "text"
    );

    const content = textBlock?.content ?? {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    };

    // 現在のEditor内容と保存されている内容を比較
    const currentContent = editor.getJSON();

    const isSameContent =
      JSON.stringify(currentContent) ===
      JSON.stringify(content);

    // 内容が違う場合だけEditorを更新
    if (!isSameContent) {
      editor.commands.setContent(
        content,
        {
          emitUpdate: false,
        }
      );
    }
  }, [
    editor,
    widget.selectedDate,
    diaryEntries,
  ]);

  // =========================
  // 日付変更
  // =========================

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

  // =========================
  // 日付表示
  // =========================

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

  // =========================
  // Render
  // =========================

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
        className="
          min-h-0
          flex-1
          overflow-y-auto
          text-xs
          text-gray-700

          [&_.ProseMirror]:min-h-full
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:leading-5

          [&_.ProseMirror_p]:m-0

          [&_.ProseMirror_h1]:m-0
          [&_.ProseMirror_h1]:text-xl
          [&_.ProseMirror_h1]:font-bold

          [&_.ProseMirror_h2]:m-0
          [&_.ProseMirror_h2]:text-lg
          [&_.ProseMirror_h2]:font-bold

          [&_.ProseMirror_h3]:m-0
          [&_.ProseMirror_h3]:text-base
          [&_.ProseMirror_h3]:font-bold

          [&_.ProseMirror_ul]:m-0
          [&_.ProseMirror_ul]:list-disc
          [&_.ProseMirror_ul]:pl-5

          [&_.ProseMirror_ol]:m-0
          [&_.ProseMirror_ol]:list-decimal
          [&_.ProseMirror_ol]:pl-5

          [&_.ProseMirror_li]:ml-1

          /* =========================
             Task List
          ========================= */

          [&_.ProseMirror_ul[data-type='taskList']]:m-0
          [&_.ProseMirror_ul[data-type='taskList']]:list-none
          [&_.ProseMirror_ul[data-type='taskList']]:pl-0

          [&_.ProseMirror_li[data-type='taskItem']]:flex
          [&_.ProseMirror_li[data-type='taskItem']]:items-start
          [&_.ProseMirror_li[data-type='taskItem']]:gap-1

          [&_.ProseMirror_li[data-type='taskItem']>label]:shrink-0

          [&_.ProseMirror_li[data-type='taskItem']>div]:min-w-0
          [&_.ProseMirror_li[data-type='taskItem']>div]:flex-1

          /* =========================
             Blockquote
          ========================= */

          [&_.ProseMirror_blockquote]:border-l-2
          [&_.ProseMirror_blockquote]:border-gray-300
          [&_.ProseMirror_blockquote]:pl-3

          /* =========================
             Inline Code
          ========================= */

          [&_.ProseMirror_code]:rounded
          [&_.ProseMirror_code]:bg-gray-200
          [&_.ProseMirror_code]:px-1
          [&_.ProseMirror_code]:text-xs

          /* =========================
             Placeholder
          ========================= */

          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
        "
      />

    </div>
  );
}