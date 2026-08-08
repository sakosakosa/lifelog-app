import { useDroppable } from "@dnd-kit/core";

type Props = {
    index: number;
    x: number;
    y: number;
};

export default function Cell({
    index,
    x,
    y,
}: Props) {
    const { setNodeRef } = useDroppable({
        id: `cell-${x}-${y}`,
        data: {
            x,
            y,
        },
    });
    return (
        <div
            ref={setNodeRef}
            className="h-full w-full rounded border border-gray-300 bg-white"
        >
        </div>
    );
}