"use client";

import { useDraggable } from "@dnd-kit/core";

type Props = {
  id: string;
  icon: string;
  name: string;
};

export default function DraggableWidget({
  id,
  icon,
  name,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id,
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
      {icon} {name}
    </div>
  );
}