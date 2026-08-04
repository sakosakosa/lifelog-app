import { WidgetInstance } from "@/types/widget";
import DiaryWidget from "./DiaryWidget";
import SpotifyWidget from "./SpotifyWidget";
import ClockWidget from "./ClockWidget";
import WeightWidget from "./WeightWidget";

type Props = {
  widget: WidgetInstance;
};

export default function WidgetRenderer({
  widget,
}: Props) {
  switch (widget.type) {
  case "diary":
    return (
      <DiaryWidget
        content={widget.content}
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