import { useDraggable, useDroppable } from "@dnd-kit/core";
import { widgets } from "@/data/widgets";
import DiaryWidget from "./widgets/DiaryWidget";
import WidgetRenderer from "./widgets/WidgetRenderer";

type Widget = {
    id: string;
    type: string;
};

type Props = {
    index: number;
    widget?: Widget;
    onDelete: (index: number) => void;
    onContextMenu: (
        x: number,
        y: number,
        cellIndex: number
    ) => void;
};

export default function Cell({
    index,
    widget,
    onDelete,
    onContextMenu,
}: Props) {
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
            className="rounded border border-gray-300 bg-white"
            style={{
                gridColumn: `span ${widget?.layout.width ?? 1}`,
                gridRow: `span ${widget?.layout.height ?? 1}`,
            }}
        >
            {widget && (
                <div
                    ref={setDragRef}
                    style={style}
                    {...listeners}
                    {...attributes}
                    onContextMenu={(e) => {
                        e.preventDefault();

                        onContextMenu(
                            e.clientX,
                            e.clientY,
                            index
                        );
                    }}
                    className="h-full w-full cursor-grab active:cursor-grabbing"
                >
                    <WidgetRenderer widget={widget} />
                </div>
            )}
        </div>
    );
}