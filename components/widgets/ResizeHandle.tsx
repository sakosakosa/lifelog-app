"use client";

import { useDraggable } from "@dnd-kit/core";

type Props = {
  widgetId: string;
};

export default function ResizeHandle({ widgetId }: Props) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `resize-${widgetId}`,
    data: {
      source: "resize",
      widgetId,
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      aria-label="サイズを変更"
      className="absolute bottom-0 right-0 z-10 h-3 w-3 cursor-se-resize bg-gray-500"
      {...attributes}
      {...listeners}
    />
  );
}