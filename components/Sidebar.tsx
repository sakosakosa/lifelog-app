import DraggableWidget from "./DraggableWidget";
import { sidebarWidgetDefinitions } from "@/data/sidebarWidgetDefinitions";


export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-gray-100 p-4">
      <h2 className="mb-6 text-xl font-bold">
        Widgets
      </h2>

      <div className="space-y-3">
        {sidebarWidgetDefinitions.map((sidebarWidgetDefinitions) => (
          <DraggableWidget
            key={sidebarWidgetDefinitions.widgetType}
            widgetType={sidebarWidgetDefinitions.widgetType}
            widgetIcon={sidebarWidgetDefinitions.widgetIcon}
            widgetName={sidebarWidgetDefinitions.widgetName}
          />
        ))}
      </div>
    </aside>
  );
}