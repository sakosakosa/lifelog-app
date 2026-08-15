import type { JSONContent } from "@tiptap/core";

export type WidgetType =
  | "diary"
  | "spotify"
  | "clock"
  | "weight";

export type Layout = {
  width: number;
  height: number;
};

export type BaseWidget = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

/* =========================
   Diary
========================= */

export type DiaryWidget = BaseWidget & {
  type: "diary";
  selectedDate: string;
  entries: DiaryEntry[];
};

export type DiaryEntry = {
  id: string;
  date: string;
  blocks: DiaryBlock[];
};

export type DiaryBlock =
  | TextBlock
  | CaptureBlock;

export type TextBlock = {
  id: string;
  type: "text";
  content: JSONContent;
};

export type CaptureBlock = {
  id: string;
  type: "capture";
  captureType:
    | "spotify"
    | "timer"
    | "weight";
  sourceId: string;
};

export type SpotifyWidget = BaseWidget & {
  type: "spotify";
};

export type ClockWidget = BaseWidget & {
  type: "clock";
};

export type WeightWidget = BaseWidget & {
  type: "weight";
};

export type WidgetInstance =
  | DiaryWidget
  | SpotifyWidget
  | ClockWidget
  | WeightWidget;