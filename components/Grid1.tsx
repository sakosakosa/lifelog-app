import GridBackground from "./GridBackground";
import WidgetLayer from "@/components/widgets/WidgetLayer";
// import Overlay from "./Overlay";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
    widgetInstances: WidgetInstance[];
    onContextMenu: (
        x: number,
        y: number,
        widgetId: string
    ) => void;
};

const columns = 10;
const rows = 10;

export default function Grid({
    widgetInstances,
    onContextMenu,
}: Props) {

    return (
        <div className="relative w-full h-full min-w-0 flex-1">
    <GridBackground
        columns={columns}
        rows={rows}
    />

    <WidgetLayer
        widgetInstances={widgetInstances}
        onContextMenu={onContextMenu}
        columns={columns}
        rows={rows}
    />

    {/* <Overlay /> */}
    </div>

    )
}