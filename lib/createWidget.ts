import { WidgetInstance, WidgetType } from "@/types/widgetTypes";

export function createWidget(
  type: WidgetType,
  x: number,
  y: number
): WidgetInstance {
  const base = {
    id: crypto.randomUUID(),
    type,
    x,
    y,
    width: 1,
    height: 1,
  };

  switch (type) {
    case "diary":
      return {
        ...base,
        content: "",
      };

    case "spotify":
    case "clock":
    case "weight":
      return base;
  }
}