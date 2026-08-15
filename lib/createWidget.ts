import { WidgetInstance, WidgetType } from "@/types/widgetTypes";

function getTodayString() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createWidget(
  type: WidgetType,
  x: number,
  y: number
): WidgetInstance {
  const base = {
    id: crypto.randomUUID(),
    x,
    y,
    width: 1,
    height: 1,
  };

  switch (type) {
    case "diary":
      return {
        ...base,
        type: "diary",
        selectedDate: getTodayString(),
        entries: [],
      };

    case "spotify":
      return {
        ...base,
        type: "spotify",
      };

    case "clock":
      return {
        ...base,
        type: "clock",
      };

    case "weight":
      return {
        ...base,
        type: "weight",
      };
  }
}