import Cell from "./Cell";

type Props = {
    columns: number;
    rows: number;
};

export default function GridBackground({
    columns,
    rows }: Props) {

    return (
        <div
            className="grid h-full w-full gap-1 p-4"
            style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
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
        </div>
    );
}