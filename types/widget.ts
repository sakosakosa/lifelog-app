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