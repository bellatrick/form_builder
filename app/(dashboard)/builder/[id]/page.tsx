import { GetFormsById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";

const BuilderPage = async ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const form = await GetFormsById(Number(params.id));
  if(!form){
    throw new Error('Form not found')
  }
  return <FormBuilder form={form}/>;
};

export default BuilderPage;
