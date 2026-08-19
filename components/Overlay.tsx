import {
  DragOverlay,
  useDndContext,
} from "@dnd-kit/core";

import WidgetResizingOverlay from "./WidgetResizingOverlay";

import {
  ResizeState,
} from "@/types/resizeTypes";

import {
  WidgetInstance,
  DiaryEntry,
  TimerTask,
} from "@/types/widgetTypes";

import TimerCaptureOverlay from "@/components/widgets/TimerWidget/TimerCaptureOverlay";

type Props = {
  resizeState: ResizeState | null;
  widget: WidgetInstance | null;
  diaryEntries: DiaryEntry[];
  timerTasks: TimerTask[];
};

export default function Overlay({
  resizeState,
  widget,
  diaryEntries,
  timerTasks,
}: Props) {
  const { active } = useDndContext();

  const dragData =
    active?.data.current;

  const isTimerCapture =
    dragData?.type === "timer";

  return (
    <>
      {/* =========================
          Widgetリサイズ用Overlay
      ========================= */}

      <WidgetResizingOverlay
        resizeState={resizeState}
        widget={widget}
        diaryEntries={diaryEntries}
        timerTasks={timerTasks}
      />

      {/* =========================
          Captureドラッグ用Overlay
      ========================= */}

      <DragOverlay>
        {isTimerCapture &&
        dragData?.id ? (
          <TimerCaptureOverlay
            id={dragData.id}
          />
        ) : null}
      </DragOverlay>
    </>
  );
}