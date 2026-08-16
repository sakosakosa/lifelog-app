import {
  ResizeState,
} from "@/types/resizeTypes";

import {
  WidgetInstance,
  DiaryEntry,
  TimerTask,
} from "@/types/widgetTypes";

import WidgetRenderer from "./widgets/WidgetRenderer";

type Props = {
  resizeState: ResizeState | null;
  widget: WidgetInstance | null;
  diaryEntries: DiaryEntry[];
  timerTasks: TimerTask[];
};

export default function WidgetResizingOverlay({
  resizeState,
  widget,
  diaryEntries,
  timerTasks,
}: Props) {
  if (!resizeState || !widget) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-20"
      style={{
        left: resizeState.x,
        top: resizeState.y,
        width: resizeState.width,
        height: resizeState.height,
      }}
    >
      <WidgetRenderer
        widget={widget}
        diaryEntries={diaryEntries}
        timerTasks={timerTasks}
        onWidgetChange={() => {}}
        onDiaryChange={() => {}}
        onTimerChange={() => {}}
      />
    </div>
  );
}