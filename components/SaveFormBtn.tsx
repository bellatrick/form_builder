import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "./hooks/useDesigner";
import { UpdateFormContent } from "@/actions/form";
import { toast } from "./ui/use-toast";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({id}:{id:number}) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);
      toast({
        title: "success",
        description: "Your form has been saved",
      });
    } catch (error) {
      toast({
        title: "error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      disabled={loading}
      onClick={() => startTransition(updateFormContent)}
      variant={"outline"}
      className="gap-2"
    >
      <HiSaveAs className="w-4 h-4" />
      {loading ? <FaSpinner className="h-4 w-4 animate-spin" /> : <p>Save</p>}
    </Button>
  );
}

export default SaveFormBtn;
