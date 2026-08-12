import { ResizeState } from "@/types/resizeTypes";
import { WidgetInstance } from "@/types/widgetTypes";
import WidgetRenderer from "./widgets/WidgetRenderer";

type Props = {
  resizeState: ResizeState | null;
  widget: WidgetInstance | null;
};

export default function WidgetResizingOverlay({
  resizeState,
  widget,
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
      <WidgetRenderer widget={widget} />
    </div>
  );
}