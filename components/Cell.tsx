import { useDraggable, useDroppable } from "@dnd-kit/core";
import { widgets } from "@/data/widgets";

type Widget = {
  id: string;
  type: string;
};

type Props = {
  index: number;
  widget?: Widget;
};

export default function Cell({
  index,
  widget,
}: Props) {
  const widgetData = widgets.find((w) => w.id === widget?.type);

  const { setNodeRef } = useDroppable({
    id: index,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({
    id: widget?.id ?? "",
    data: {
      source: "grid",
      cellIndex: index,
      type: widget?.type,
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
      className="flex flex-col items-center justify-center rounded border border-gray-300 bg-white"
    >
      {widget && (
        <div
          ref={setDragRef}
          style={style}
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing"
        >
          <div>{widgetData?.icon}</div>
          <div className="text-xs">{widgetData?.name}</div>
        </div>
      )}
    </div>
  );
}