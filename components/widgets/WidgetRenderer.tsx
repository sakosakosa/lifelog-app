import {
  WidgetInstance,
  DiaryEntry,
} from "@/types/widgetTypes";
import DiaryWidget from "./DiaryWidget";
import SpotifyWidget from "./SpotifyWidget";
import ClockWidget from "./ClockWidget";
import WeightWidget from "./WeightWidget";

type Props = {
  widget: WidgetInstance;
  diaryEntries: DiaryEntry[];
  onWidgetChange: (widget: WidgetInstance) => void;
  onDiaryChange: (entries: DiaryEntry[]) => void;
};

export default function WidgetRenderer({
  widget,
  diaryEntries,
  onWidgetChange,
  onDiaryChange,
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

    case "spotify":
      return <SpotifyWidget />;

    case "clock":
      return <ClockWidget />;

    case "weight":
      return <WeightWidget />;

    default:
      return null;
  }
}