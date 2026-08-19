import type { JSONContent } from "@tiptap/core";

export type WidgetType =
  | "diary"
  | "spotify"
  | "timer"
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

export type CaptureBlock =
  | TimerCaptureBlock
  | SpotifyCaptureBlock
  | WeightCaptureBlock;

export type BaseCaptureBlock = {
  id: string;
  type: "capture";
};

/* =========================
   Timer Capture
========================= */

export type TimerCaptureBlock =
  BaseCaptureBlock & {
    captureType: "timer";
    data: TimerCaptureData;
  };

export type TimerCaptureData = {
  taskName: string;
  date: string;
  sessions: TimerCaptureSession[];
  totalDuration: number;
};

export type TimerCaptureSession = {
  startedAt: string;
  endedAt: string;
  duration: number;
};

/* =========================
   Spotify
========================= */

export type SpotifyWidget = BaseWidget & {
  type: "spotify";
};

/* =========================
   Timer
========================= */

export type TimerWidget = BaseWidget & {
  type: "timer";
};

export type TimerTask = {
  id: string;
  taskName: string;
  sessions: TimerSession[];
};

export type TimerSession = {
  id: string;
  date: string;
  startedAt: string;
  endedAt: string;
  duration: number;
};

/* =========================
   Weight
========================= */

export type WeightWidget = BaseWidget & {
  type: "weight";
};

/* =========================
   Widget Instance
========================= */

export type WidgetInstance =
  | DiaryWidget
  | SpotifyWidget
  | TimerWidget
  | WeightWidget;