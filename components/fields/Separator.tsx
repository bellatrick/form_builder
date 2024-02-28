"use client";

import React from "react";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
} from "../FormElements";

import { Label } from "../ui/label";

import { RiSeparator } from "react-icons/ri";
import { Separator } from "../ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
  type,
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "Separator field",
  },
  validate: () => true,
};
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  return (
    <div className="flex  flex-col gap-2 w-full">
      <Label className="text-muted-foreground">Separator field</Label>
      <Separator />
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  return <div>No properties for this element</div>;
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  return <Separator />;
}
