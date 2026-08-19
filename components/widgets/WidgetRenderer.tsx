import {
  WidgetInstance,
  DiaryEntry,
  TimerTask,
} from "@/types/widgetTypes";

import DiaryWidget from "./DiaryWidget/DiaryWidget";
import SpotifyWidget from "./SpotifyWidget";
import TimerWidget from "./TimerWidget/TimerWidget";
import WeightWidget from "./WeightWidget";


type Props = {
  widget: WidgetInstance;

  diaryEntries: DiaryEntry[];
  timerTasks: TimerTask[];

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

export default function WidgetRenderer({
  widget,

  diaryEntries,
  timerTasks,

  onWidgetChange,
  onDiaryChange,
  onTimerChange,
}: Props) {
  switch (widget.type) {

    case "diary":
      return (
        <DiaryWidget
          widget={widget}
          diaryEntries={diaryEntries}
          onChange={onWidgetChange}
          onDiaryChange={onDiaryChange}
        />
      );

    case "timer":
      return (
        <TimerWidget
          widget={widget}
          timerTasks={timerTasks}
          onTimerChange={onTimerChange}
        />
      );

    case "spotify":
      return <SpotifyWidget />;

    case "weight":
      return <WeightWidget />;

    default:
      return null;
  }
}