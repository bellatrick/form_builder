"use client";

import React, { useState } from "react";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import DesignerSidebar from "./DesignerSidebar";
import { cn } from "@/lib/utils";
import {
  ElementsType,
  FormElements,
  FormElementsInstance,
} from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";

function Designer() {
  const {
    elements,
    addElement,
    selectedElement,
    removeElement,
    setSelectedElement,
  } = useDesigner();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });
  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;

      if (!active || !over) return;

      const overId = over?.data?.current?.elementId;
      const activeId = active?.data?.current?.elementId;

      const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea =
        over?.data?.current?.isDesignerDropArea;

      const isDroppingOverDesignerElementTopHalf =
        over?.data?.current?.isTopHalfDesignerElement;

      const isDroppingOverDesignerElementBottomHalf =
        over?.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementBottomHalf |
        isDroppingOverDesignerElementTopHalf;

      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;

      // For when new form element is being dragged to the builder
      if (isDesignerBtnElement && isDroppingOverDesignerDropArea) {
        const type = active?.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        );
        addElement(elements.length, newElement);
      }

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active?.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, newElement);
      }
      const isDraggingDesignerElement =
        active?.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;
      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId
        );
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, activeElement);
      }
    },
  });
  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) {
            setSelectedElement(null);
          }
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-1 flex-grow items-center justify-start overflow-y-auto",
            droppable.isOver && "ring-2 ring-primary/20"
          )}
        >
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop here
            </p>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({
  element,
}: {
  element: FormElementsInstance;
}) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const draggable = useDraggable({
    id: element.id,
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });
  if (draggable.isDragging) return null;

  const DesignerComponent = FormElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      className="relative h-[120px] flex flex-col text-muted-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute z-1  w-full h-1/2 rounded-t-md"
      ></div>
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute z-1  w-full h-1/2 rounded-b-md bottom-0"
      ></div>
      {mouseIsOver && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
            className="absolute z-100 right-0 h-full"
          >
            <Button
              variant={"outline"}
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse ">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      <div
        className={cn(
          "flex opacity-100 w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-6 pointer-events-none",
          mouseIsOver && "opacity-30",
          topHalf.isOver && "border-t-4 border-t-foreground",
          bottomHalf.isOver && "border-b-4 border-b-foreground"
        )}
      >
        <DesignerComponent elementInstance={element} />
      </div>
    </div>
  );
}
export default Designer;
