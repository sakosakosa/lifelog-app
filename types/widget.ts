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
  layout: Layout;
};

export type DiaryWidget = BaseWidget & {
  type: "diary";
  content: string;
};

export type WidgetInstance = BaseWidget | DiaryWidget;