import WidgetResizingOverlay from "./WidgetResizingOverlay";
import { ResizeState } from "@/types/resizeTypes";
import {
  WidgetInstance,
  DiaryEntry,
} from "@/types/widgetTypes";

type Props = {
  resizeState: ResizeState | null;
  widget: WidgetInstance | null;
  diaryEntries: DiaryEntry[];
};

export default function Overlay({
  resizeState,
  widget,
  diaryEntries,
}: Props) {
  return (
    <WidgetResizingOverlay
      resizeState={resizeState}
      widget={widget}
      diaryEntries={diaryEntries}
    />
  );
}