import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { ElementsType, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";

function DragOverlayWrapper() {
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  const type = draggedItem?.data?.current?.type as ElementsType;
  useDndMonitor({
    onDragStart: (event) => setDraggedItem(event.active),
    onDragCancel: () => setDraggedItem(null),
    onDragEnd: () => setDraggedItem(null),
  });
  let node = <div>No drag overlay</div>;
  if (!draggedItem) return null;
  const isSidebarBtnElement = draggedItem?.data?.current?.isDesignerBtnElement;
  const isDesignerElement = draggedItem?.data?.current?.isDesignerElement;

  if (isSidebarBtnElement) {
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }
  if (isDesignerElement) {
    const elementId = draggedItem?.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if (!element) {
      node = <div>Element not found</div>;
    } else {
      const DesignerElementComponent =
        FormElements[element.type].designerComponent;
      node = (
        <div className="bg-accent flex border rounded-md h-[120px] opacity-80 w-full py-2 px-4 pointer-events-none">
          <DesignerElementComponent elementInstance={element} />
        </div>
      );
    }
  }
  return <DragOverlay>{node}</DragOverlay>;
}

export default DragOverlayWrapper;
