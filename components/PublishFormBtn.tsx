import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { MdOutlinePublish } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { FaIcons } from "react-icons/fa";
import { toast } from "./ui/use-toast";
import { PublishMainForm } from "@/actions/form";
import { useRouter } from "next/navigation";
import useDesigner from "./hooks/useDesigner";

const PublishFormBtn = ({ id }: { id: number }) => {
  const [loading, startTransition] = useTransition();
  const { elements } = useDesigner();
  const router = useRouter();
  async function PublishForm() {
    const jsonElements = JSON.stringify(elements);
    try {
      await PublishMainForm(id, jsonElements);
      toast({
        title: "success",
        description: "Your form is now available to recieve submissions",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="gap-2 text-wite bg-gradient-to-r from-indigo-400 to-cyan-400"
        >
          <MdOutlinePublish className="w-4 h-4" />
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogHeader>
          <AlertDialogDescription className="text-[18px] space-y-1 flex flex-col">
            <span>
              This action cannot be undone. After publishing, you will not be
              able to edit this form.
            </span>{" "}
            <br />
            <span className="font-medium text-sm ">
              By publishing this form, you will make it available to the public
              and you will be able to collect submissions
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(PublishForm);
            }}
          >
            {loading ? <FaIcons className="animate-spin" /> : <p>Proceed</p>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PublishFormBtn;
