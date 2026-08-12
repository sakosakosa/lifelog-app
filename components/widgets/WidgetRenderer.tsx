import { WidgetInstance } from "@/types/widgetTypes";
import DiaryWidget from "./DiaryWidget";
import SpotifyWidget from "./SpotifyWidget";
import ClockWidget from "./ClockWidget";
import WeightWidget from "./WeightWidget";

type Props = {
  widget: WidgetInstance;
  onContentChange: (
    id: string,
    content: string
  ) => void;
};

export default function WidgetRenderer({
  widget,
  onContentChange,
}: Props) {
  switch (widget.type) {
    case "diary":
      return (
        <DiaryWidget
          content={widget.content}
          onChange={(content) => {
            onContentChange(widget.id, content);
          }}
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