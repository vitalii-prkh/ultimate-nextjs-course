"use client";

import Image from "next/image";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {deleteAnswer} from "@/lib/actions/answer.actions";
import {deleteQuestion} from "@/lib/actions/question.actions";
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
} from "@/components/ui/alert-dialog";
import {buildPath} from "@/lib/path/buildPath";
import {ROUTES} from "@/refs/routes";

type UpdateDeleteActionsProps = {
  type: string;
  itemId: string;
};

export function UpdateDeleteActions(props: UpdateDeleteActionsProps) {
  const router = useRouter();

  const handleEdit = async () => {
    router.push(buildPath(ROUTES.QUESTION_UPDATE, {questionId: props.itemId}));
  };

  const handleDelete = async () => {
    if (props.type === "Question") {
      // Call API to delete a question
      await deleteQuestion({questionId: props.itemId});

      toast.success("Question deleted", {
        description: "Your question has been deleted successfully.",
      });
    } else if (props.type === "Answer") {
      // Call API to delete an answer
      await deleteAnswer({answerId: props.itemId});

      toast.success("Answer deleted", {
        description: "Your answer has been deleted successfully.",
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${props.type === "Answer" && "justify-center gap-0"}`}
    >
      {props.type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}

      <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image
            src="/icons/trash.svg"
            alt="trash"
            width={14}
            height={14}
          />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {props.type === "Question" ? "question" : "answer"} and remove it
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
