import Cell from "./Cell";
import WidgetContainer from "./widgets/WidgetContainer";
import { WidgetInstance } from "@/types/widgetTypes";

type Props = {
  widgetInstances: WidgetInstance[];
  onContextMenu: (
    x: number,
    y: number,
    widgetId: string
  ) => void;
};

export default function Grid({
  widgetInstances,
  onContextMenu,
}: Props) {
  const columns = 10;
  const rows = 10;

  return (
    <div
      className="grid flex-1 gap-1 p-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0,1fr))`,
      }}
    >
      {/* 背景セル */}
      {Array.from({ length: rows * columns }).map((_, index) => {
        const x = index % columns;
        const y = Math.floor(index / columns);

        return (
          <Cell
            key={index}
            index={index}
            x={x}
            y={y}
          />
        );
      })}

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
            onDelete={onDelete}
            onContextMenu={onContextMenu}
          />
        </div>
      ))}
    </div>
  );
}