"use client";

import { useDraggable } from "@dnd-kit/core";
import WidgetRenderer from "./WidgetRenderer";
import ResizeHandle from "./ResizeHandle";
import { WidgetInstance } from "@/types/widgetTypes";
import DragHandle from "./DragHandle";

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
  onWidgetChange: (widget: WidgetInstance) => void;
};

export default function WidgetContainer({
  widget,
  isResizing,
  widgetRefs,
  onContextMenu,
  onWidgetChange,
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
      className="relative h-full w-full"
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
      <DragHandle
        attributes={attributes}
        listeners={listeners}
      />
      <div className="relative h-full w-full"
        style={{
          visibility: isResizing ? "hidden" : "visible",
        }}
      >
        <WidgetRenderer
          widget={widget}
          onWidgetChange={onWidgetChange}
        />
        <ResizeHandle widgetId={widget.id} />
      </div>
    </div>
  );
}