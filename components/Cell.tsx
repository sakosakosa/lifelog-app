import { useDraggable, useDroppable } from "@dnd-kit/core";
import { widgets } from "@/data/widgets";
import DiaryWidget from "./widgets/DiaryWidget";

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
    const widgetData = widgets.find((w) => w.id === widget?.type);
    const isDiaryWidget = widget?.type === "diary";

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
                    {isDiaryWidget ? (
                        <DiaryWidget content={widget.content} />
                    ) : (
                        <>
                            <div>{widgetData?.icon}</div>
                            <div className="text-xs">{widgetData?.name}</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}