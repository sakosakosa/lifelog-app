import { useDraggable } from "@dnd-kit/core";

type Props = {
    id: string;
    type: string;
    children: React.ReactNode;
};

export default function DraggableCapture({
    id,
    type,
    children,
}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
    } = useDraggable({
        id: `capture-${type}-${id}`,

        data: {
            source: "capture",
            type,
            id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    );
}