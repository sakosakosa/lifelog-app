import { useDroppable } from "@dnd-kit/core";



type Props = {
    index: number;
};

export default function Cell({ index }: Props) {
const { setNodeRef } = useDroppable({
    id: index,
});

    return (
        <div
            ref={setNodeRef}
            className="rounded border border-gray-300 bg-white"
        />
    );
}