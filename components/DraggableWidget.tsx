"use client";

import { useDraggable } from "@dnd-kit/core";

type Props = {
  widgetType: string;
  widgetIcon: string;
  widgetName: string;
};

export default function DraggableWidget({
  widgetType,
  widgetIcon,
  widgetName,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: widgetType,
      data: {
        source: "sidebar",
        widgetType: widgetType,
      },
    });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border bg-white p-3 shadow active:cursor-grabbing"
    >
      {widgetIcon} {widgetName}
    </div>
  );
}