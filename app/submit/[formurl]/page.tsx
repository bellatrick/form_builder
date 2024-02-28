import { GetFormContentByUrl } from "@/actions/form";
import { FormElementsInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";

const SubmitPage =async ({
  params,
}: {
  params: {
    formurl: string;
  };
}) => {
  const form=await GetFormContentByUrl(params.formurl)
  if(!form){
    throw new Error('Form not found')
  }
  const formContent =JSON.parse(form.content) as FormElementsInstance[]
  return <FormSubmitComponent formUrl={params.formurl} content={formContent}/>
};

export default SubmitPage;
