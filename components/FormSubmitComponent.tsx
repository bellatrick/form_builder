"use client";

import React, {  useRef, useState, useTransition } from "react";
import { FormElements, FormElementsInstance } from "./FormElements";
import { Button } from "./ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "./ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";

function FormSubmitComponent({
  formUrl,
  content,
}: {
  formUrl: string;
  content: FormElementsInstance[];
}) {
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const formValues = useRef<{ [key: string]: string }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  
  const submitValue = (key: string, value: string) => {
    formValues.current[key] = value;
  };
  const validateForm = () => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);
      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }
    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }
    return true;
  };

  async function submitForm() {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }
    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  }
  if (submitted) {
    return (
      <div className="flex justify-center w-full items-center p-8 ">
        <div className="flex-grow max-w-[620px] flex flex-col gap-4 bg-background w-full p-8 overflow-y-auto shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl font-bold">Form Submitted</h1>
          <p className="text-muted-foreground">Thank you for submitting the form.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center h-full w-full items-center p-8">
      <div
        key={renderKey}
        className="flex-grow max-w-[620px] flex flex-col gap-4 bg-background w-full p-8 overflow-y-auto shadow-xl shadow-blue-700 rounded"
      >
        {content.map((el) => {
          const FormElement = FormElements[el.type].formComponent;
          return (
            <FormElement
              key={el.id}
              elementInstance={el}
              submitValue={submitValue}
              isInvalid={formErrors.current[el.id]}
              defaultValues={formValues.current[el.id]}
            />
          );
        })}
        <Button
          disabled={pending}
          className="mt-8"
          onClick={() => startTransition(submitForm)}
        >
          <>
            {pending ? (
              <ImSpinner2 className="animate-spin" />
            ) : (
              <>
                {" "}
                <HiCursorClick className="mr-2" />
                Submit
              </>
            )}
          </>
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
