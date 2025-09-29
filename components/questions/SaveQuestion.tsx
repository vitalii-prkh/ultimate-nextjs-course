"use client";

import React from "react";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {toast} from "sonner";
import {toggleSaveQuestion} from "@/lib/actions/collection.actions";
import {hasSaveQuestion} from "@/lib/actions/collection.actions";

type SaveQuestionProps = {
  questionId: string;
  hasSavedPromise: Promise<Awaited<ReturnType<typeof hasSaveQuestion>>>;
};

export function SaveQuestion(props: SaveQuestionProps) {
  const {questionId} = props;
  const [isPending, setPending] = React.useState(false);
  const session = useSession();
  const userId = session.data?.user?.id;
  const {data} = React.use(props.hasSavedPromise);

  const handleClick = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    if (!userId) {
      toast.error("You must be logged in to save a question");

      return;
    }

    try {
      setPending(true);

      const {success, data, error} = await toggleSaveQuestion({questionId});

      if (!success) {
        throw new Error(error?.message || "Failed to save question");
      }

      toast.success(
        `Question ${data?.saved ? "saved" : "unsaved"} successfully`,
      );
    } catch (error) {
      toast.error("Failed to save question", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Image
      src={data?.saved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      alt="Save Question"
      width={18}
      height={18}
      className={`cursor-pointer ${isPending ? "opacity-50" : ""}`}
      aria-label="Save Question"
      onClick={handleClick}
    />
  );
}
