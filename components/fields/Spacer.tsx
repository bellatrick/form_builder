"use client";

import React, { useEffect, useState } from "react";
import {
  ElementsType,
  FormElement,
  FormElementsInstance,
  SubmitFunction,
} from "../FormElements";
import { MdTextFields } from "react-icons/md";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDesigner from "../hooks/useDesigner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";
const extraAttributes = {
  height: 20,
};
const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
  type,
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Spacer field",
  },
  validate: () => true,
};
type CustomInstance = FormElementsInstance & {
  extraAttributes: typeof extraAttributes;
};
function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return (
    <div className="flex gap-2 justify-center w-full items-center">
      <Label className="text-muted-foreground">
        <p> Spacer field: {height}px</p>
      </Label>
      <LuSeparatorHorizontal className="self-center h-8 w-8" />
    </div>
  );
}
type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height,
    },
  });
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...values,
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
        onBlur={form.handleSubmit(applyChanges)}
      >
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (px): {form.watch("height")}</FormLabel>
              <FormControl className="pt-2">
                <Slider
                  defaultValue={[field.value]}
                  min={5}
                  max={200}
                  step={1}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementsInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return <div style={{ height, width: "100%" }}></div>;
}
