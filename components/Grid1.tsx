import GridBackground from "./GridBackground";
import WidgetLayer from "@/components/widgets/WidgetLayer";
import Overlay from "./Overlay";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
    widgetInstances: WidgetInstance[];
    resizeState: ResizeState | null
    resizingWidgetId: string | null;
    widgetRefs: React.MutableRefObject<
        Record<string, HTMLDivElement | null>
    >;
    onContextMenu: (
        x: number,
        y: number,
        widgetId: string
    ) => void;
    onContentChange: (
        id: string,
        content: string
    ) => void;
};

const columns = 10;
const rows = 10;



export default function Grid({
    widgetInstances,
    resizeState,
    resizingWidgetId,
    widgetRefs,
    onContextMenu,
    onContentChange,
}: Props) {
    const resizingWidget = resizeState
        ? widgetInstances.find(
            (widget) => widget.id === resizeState.widgetId
        ) ?? null
        : null;

    return (
        <div className="relative w-full h-full min-w-0 flex-1">
            <GridBackground
                columns={columns}
                rows={rows}
            />

            <WidgetLayer
                widgetInstances={widgetInstances}
                resizingWidgetId={resizingWidgetId}
                widgetRefs={widgetRefs}
                onContentChange={onContentChange}
                onContextMenu={onContextMenu}
                columns={columns}
                rows={rows}
            />

            <Overlay
                resizeState={resizeState}
                widget={resizingWidget}
            />
        </div>

    )
}