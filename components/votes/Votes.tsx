"use client";

import React from "react";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {toast} from "sonner";
import {cn, formatNumber} from "@/lib/utils";

type VotesProps = {
  upvotes: number;
  downvotes: number;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
};

export function Votes(props: VotesProps) {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isPending, setPending] = React.useState(false);
  const handleClick = (
    event: React.MouseEvent,
    type: "upvote" | "downvote",
  ) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    if (!userId) {
      toast.warning("You must be logged in to vote", {
        description: "Only logged in users can vote",
      });

      return;
    }

    setPending(true);

    try {
      const successMessage =
        type === "upvote"
          ? props.hasUpvoted
            ? "Upvote removed successfully"
            : "Upvote added successfully"
          : props.hasDownvoted
            ? "Downvote removed successfully"
            : "Downvote added successfully";

      toast.success(successMessage, {
        description: "Your vote has been recorded.",
      });
    } catch (error) {
      toast.error("Failed to vote", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while voting",
      });
    } finally {
      setPending(false);
    }
  };
  const handleUpvote = (event: React.MouseEvent) => {
    handleClick(event, "upvote");
  };
  const handleDownvote = (event: React.MouseEvent) => {
    handleClick(event, "downvote");
  };

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={props.hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
          alt="upvote"
          width={18}
          height={18}
          className={cn("cursor-pointer", {
            "opacity-50": isPending,
          })}
          aria-label="Upvote"
          onClick={handleUpvote}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(props.upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={
            props.hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"
          }
          alt="downvote"
          width={18}
          height={18}
          className={cn("cursor-pointer", {
            "opacity-50": isPending,
          })}
          aria-label="Downvote"
          onClick={handleDownvote}
        />
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(props.downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
}
