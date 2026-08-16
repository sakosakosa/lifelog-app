import GridBackground from "./GridBackground";
import WidgetLayer from "@/components/widgets/WidgetLayer";
import Overlay from "./Overlay";
import {
    WidgetInstance,
    DiaryEntry,
    TimerTask,
} from "@/types/widgetTypes";

type Props = {
    widgetInstances: WidgetInstance[];
    diaryEntries: DiaryEntry[];
    timerTasks: TimerTask[];

    resizeState: ResizeState | null;
    resizingWidgetId: string | null;

    widgetRefs: React.MutableRefObject<
        Record<string, HTMLDivElement | null>
    >;

    onContextMenu: (
        x: number,
        y: number,
        widgetId: string
    ) => void;

    onWidgetChange: (
        widget: WidgetInstance
    ) => void;

    onDiaryChange: (
        entries: DiaryEntry[]
    ) => void;

    onTimerChange: (
        tasks: TimerTask[]
    ) => void;
};

const columns = 10;
const rows = 10;

export default function Grid({
    widgetInstances,
    diaryEntries,
    timerTasks,
    resizeState,
    resizingWidgetId,
    widgetRefs,
    onContextMenu,
    onWidgetChange,
    onDiaryChange,
    onTimerChange,
}: Props) {
    const resizingWidget = resizeState
        ? widgetInstances.find(
            (widget) =>
                widget.id === resizeState.widgetId
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
                diaryEntries={diaryEntries}
                timerTasks={timerTasks}
                resizingWidgetId={resizingWidgetId}
                widgetRefs={widgetRefs}
                onWidgetChange={onWidgetChange}
                onDiaryChange={onDiaryChange}
                onTimerChange={onTimerChange}
                onContextMenu={onContextMenu}
                columns={columns}
                rows={rows}
            />

            <Overlay
                resizeState={resizeState}
                widget={resizingWidget}
                diaryEntries={diaryEntries}
                timerTasks={timerTasks}
            />

        </div>
    );
}