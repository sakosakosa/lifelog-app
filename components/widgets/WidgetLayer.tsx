import WidgetContainer from "./WidgetContainer";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
  widgetInstances: WidgetInstance[];
  resizingWidgetId : string | null;
  isResizing: boolean;
  columns: number;
  rows: number;
  widgetRefs: React.MutableRefObject<
    Record<string, HTMLDivElement | null>
  >;
  onContextMenu: (
    x: number,
    y: number,
    widgetId: string
  ) => void;
};

export default function Grid({
  widgetInstances,
  resizingWidgetId,
  isResizing,
  widgetRefs,
  onContextMenu,
  columns,
  rows,
}: Props) {

  return (
    <div
  className="absolute inset-0 grid gap-1 p-4"
  style={{
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
  }}
>

      {/* ウィジェット（同じgrid上にx,yで配置） */}
      {widgetInstances.map((widget) => (
        <div
          key={widget.id}
          style={{
            gridColumn: `${widget.x + 1} / span ${widget.width}`,
            gridRow: `${widget.y + 1} / span ${widget.height}`,
          }}
        >
          <WidgetContainer
            widget={widget}
            isResizing={resizingWidgetId === widget.id}
            widgetRefs={widgetRefs}
            onContextMenu={onContextMenu}
          />
        </div>
      ))}
    </div>
  );
}