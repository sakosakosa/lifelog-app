import WidgetResizingOverlay from "./WidgetResizingOverlay";
import { ResizeState } from "@/types/resizeTypes";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
  resizeState: ResizeState | null;
  widget: WidgetInstance | null;
};

export default function Overlay({
  resizeState,
  widget,
}: Props) {
  return (
    <WidgetResizingOverlay
      resizeState={resizeState}
      widget={widget}
    />
  );
}