import { WidgetInstance, WidgetType } from "@/types/widget";

export function createWidget(
  type: WidgetType
): WidgetInstance {
  const base = {
    id: crypto.randomUUID(),
    type,
    layout: {
      width: 1,
      height: 1,
    },
  };

  switch (type) {
    case "diary":
      return {
        ...base,
        type: "diary",
        content: "",
      };

    case "spotify":
    case "clock":
    case "weight":
      return base;
  }
}