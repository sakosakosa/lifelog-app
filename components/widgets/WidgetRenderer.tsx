import { WidgetInstance } from "@/types/widgetTypes";
import DiaryWidget from "./DiaryWidget";
import SpotifyWidget from "./SpotifyWidget";
import ClockWidget from "./ClockWidget";
import WeightWidget from "./WeightWidget";

type Props = {
  widget: WidgetInstance;
  onWidgetChange: (widget: WidgetInstance) => void;
};

export default function WidgetRenderer({
  widget,
  onWidgetChange,
}: Props) {
  switch (widget.type) {
    case "diary":
      return (
        <DiaryWidget
          widget={widget}
          onChange={onWidgetChange}
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