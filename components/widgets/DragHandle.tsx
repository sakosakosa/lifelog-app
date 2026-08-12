import { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

type Props = {
    attributes: DraggableAttributes;
    listeners: SyntheticListenerMap | undefined;
};

export default function DragHandle({
    attributes,
    listeners,
}: Props) {
    return (
        <button
            type="button"
            aria-label="ウィジェットを移動"
            className="absolute left-1/2 top-1 z-10 -translate-x-1/2 cursor-grab select-none active:cursor-grabbing"
            {...attributes}
            {...listeners}
        >
            :::
        </button>
    );
}