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
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DiaryWidget = BaseWidget & {
  type: "diary";
  content: string;
};

export type WidgetInstance = BaseWidget | DiaryWidget;