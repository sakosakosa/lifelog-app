"use client";

import { useDraggable } from "@dnd-kit/core";
import WidgetRenderer from "./WidgetRenderer";
import ResizeHandle from "./ResizeHandle";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
  widget: WidgetInstance;
  isResizing: boolean;
  widgetRefs: React.MutableRefObject<
    Record<string, HTMLDivElement | null>
  >;
  onContextMenu: (
    x: number,
    y: number,
    widgetId: string
  ) => void;
};

export default function WidgetContainer({
  widget,
  isResizing,
  widgetRefs,
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
      ref={(element) => {
        setNodeRef(element);
        widgetRefs.current[widget.id] = element;
      }}
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
      <div className="relative h-full w-full cursor-grab"
        style={{
          visibility: isResizing ? "hidden" : "visible",
        }}
      >
        <WidgetRenderer widget={widget} />
        <ResizeHandle widgetId={widget.id} />
      </div>
    </div>
  );
}