import DraggableWidget from "./DraggableWidget";
import { widgets } from "@/data/widgets";


export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-100 p-4">
      <h2 className="mb-6 text-xl font-bold">
        Widgets
      </h2>

      <div className="space-y-3">
        {widgets.map((widget) => (
          <DraggableWidget
            key={widget.id}
            id={widget.id}
            icon={widget.icon}
            name={widget.name}
          />
        ))}
      </div>
    </aside>
  );
}