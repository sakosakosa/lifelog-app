import { useDroppable } from "@dnd-kit/core";
import { widgets } from "@/data/widgets";



type Props = {
    index: number;
    widgetId?: string;
};

export default function Cell({
    index,
    widget
}: Props) {
    const widgetData = widgets.find((w) => w.id === widget);
    const { setNodeRef } = useDroppable({
        id: index,
    });
    console.log(index, widget);

    return (
        <div
            ref={setNodeRef}
            className="rounded border border-gray-300 bg-white"
        >
            <div>{widgetData?.icon}</div>
            <div className="text-xs">{widgetData?.name}</div>
        </div>
    );
}