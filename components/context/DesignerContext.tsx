"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { FormElementsInstance } from "../FormElements";

type DesignerContextType = {
  elements: FormElementsInstance[];
  setElements: Dispatch<SetStateAction<FormElementsInstance[]>>;
  addElement: (index: number, element: FormElementsInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: FormElementsInstance | null;
  setSelectedElement: Dispatch<SetStateAction<FormElementsInstance | null>>;
  updateElement: (id: string, form: FormElementsInstance) => void;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [elements, setElements] = useState<FormElementsInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementsInstance | null>(null);
  const addElement = (index: number, element: FormElementsInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };
  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id));
  };
  const updateElement = (id: string, element: FormElementsInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      const index = newElements.findIndex((el) => el.id === id);
      newElements[index] = element;
      return newElements;
    });
  };
  return (
    <DesignerContext.Provider
      value={{
        setElements,
        elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
