import Cell from "./Cell";

export default function Grid() {
  const columns = 10;
  const rows = 10;

  return (
    <div
      className="grid flex-1 gap-1 p-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: rows * columns }).map((_, index) => (
        <Cell
          key={index}
          index={index}
        />
      ))}
    </div>
  );
}