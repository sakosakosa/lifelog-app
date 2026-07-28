export default function Grid() {
    const columns = 10;
    const rows = 10;
  return (
    <div className="grid flex-1 grid-cols-10 gap-1 p-4">
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded border border-gray-300 bg-white"
        />
      ))}
    </div>
  );
}