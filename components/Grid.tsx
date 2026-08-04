import Cell from "./Cell";
import { BaseWidget } from "@/types/widget";

type Props = {
  widgetInstances: Record<number, BaseWidget>;
  onDelete: (index: number) => void;
  onContextMenu: (
    x: number,
    y: number,
    cellIndex: number
  ) => void;
};

export default function Grid({
  widgetInstances,
  onDelete,
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
        gridAutoFlow: "dense",
      }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Cell
          key={index}
          index={index}
          widget={widgetInstances[index]}
          onDelete={onDelete}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
}