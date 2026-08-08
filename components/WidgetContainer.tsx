"use client";

import { useDraggable } from "@dnd-kit/core";
import WidgetRenderer from "./widgets/WidgetRenderer";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
  widget: WidgetInstance;
  onContextMenu: (
    x: number,
    y: number,
    widgetId: string
  ) => void;
};

export default function WidgetContainer({
  widget,
  onContextMenu,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: widget.id,
    data: {
      source: "grid",
      widgetId: widget.id,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="h-full w-full cursor-grab active:cursor-grabbing"
      style={{
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(e.clientX, e.clientY, widget.id);
      }}
    >
      <div className="relative h-full w-full cursor-grab">
        <WidgetRenderer widget={widget} />
        <button
          type="button"
          className="absolute right-0 bottom-0 z-10 h-3 w-3 cursor-se-resize"
          aria-label="ウィジェットのサイズを変更"
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}