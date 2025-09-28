"use client";

import React from "react";
import {useSession} from "next-auth/react";
import Image from "next/image";
import {toast} from "sonner";
import {cn, formatNumber} from "@/lib/utils";
import {createVote, hasVoted} from "@/lib/actions/vote.actions";

type VotesProps = {
  upvotes: number;
  downvotes: number;
  targetType: "question" | "answer";
  targetId: string;
  hasVotedPromise: Promise<Awaited<ReturnType<typeof hasVoted>>>;
};

export function Votes(props: VotesProps) {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isPending, setPending] = React.useState(false);
  const {success, data} = React.use(props.hasVotedPromise);
  const handleClick = async (
    event: React.MouseEvent,
    voteType: "upvote" | "downvote",
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
      const result = await createVote({
        targetType: props.targetType,
        targetId: props.targetId,
        voteType,
      });

      if (result.success) {
        const successMessage =
          voteType === "upvote"
            ? data?.hasUpvoted
              ? "Upvote removed successfully"
              : "Upvote added successfully"
            : data?.hasDownvoted
              ? "Downvote removed successfully"
              : "Downvote added successfully";

        toast.success(successMessage, {
          description: "Your vote has been recorded.",
        });
      } else {
        toast.error("Error", {
          description: "Failed to vote",
        });
      }
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
          src={
            success && data?.hasUpvoted
              ? "/icons/upvoted.svg"
              : "/icons/upvote.svg"
          }
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
            success && data?.hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
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
