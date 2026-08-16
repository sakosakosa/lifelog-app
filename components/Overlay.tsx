import WidgetResizingOverlay from "./WidgetResizingOverlay";
import {
  ResizeState,
} from "@/types/resizeTypes";
import {
  WidgetInstance,
  DiaryEntry,
  TimerTask,
} from "@/types/widgetTypes";

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
  return (
    <WidgetResizingOverlay
      resizeState={resizeState}
      widget={widget}
      diaryEntries={diaryEntries}
      timerTasks={timerTasks}
    />
  );
}