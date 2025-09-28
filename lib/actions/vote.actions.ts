"use server";

import mongoose, {ClientSession} from "mongoose";
import {revalidatePath} from "next/cache";
import {after} from "next/server";
import {z} from "zod";
import Question from "@/db/question.model";
import Answer from "@/db/answer.model";
import Vote from "@/db/vote.model";
import {ROUTES} from "@/refs/routes";
import {buildPath} from "@/lib/path/buildPath";
import {action} from "@/lib/handlers/action";
import {handleError} from "@/lib/handlers/error";
import {
  schemaCreateVote,
  schemaHasVoted,
  schemaUpdateVoteCount,
} from "@/lib/validations";
import {createInteraction} from "@/lib/actions/interaction.actions";
import {UnauthorizedError} from "@/lib/http-errors";
import {SuccessResponse, FailureResponse} from "@/types/global";

type TUpdateVoteCountParams = z.infer<typeof schemaUpdateVoteCount>;

async function updateVoteCount(
  params: TUpdateVoteCountParams,
  session?: ClientSession,
): Promise<SuccessResponse | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaUpdateVoteCount,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {targetId, targetType, voteType, change} = validationResult.params!;
  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      {$inc: {[voteField]: change}},
      {new: true, session},
    );

    if (!result) {
      throw new Error("Failed to update vote count");
    }

    return {success: true, data: undefined};
  } catch (error) {
    return handleError(error, "server");
  }
}

type TCreateVoteCountParams = z.infer<typeof schemaCreateVote>;

export async function createVote(
  params: TCreateVoteCountParams,
): Promise<SuccessResponse | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaCreateVote,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {targetId, targetType, voteType} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return handleError(new UnauthorizedError(), "server");
  }

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const Model = targetType === "question" ? Question : Answer;
    const contentDoc = await Model.findById(targetId).session(session);

    if (!contentDoc) {
      throw new Error("Content not found");
    }

    const contentAuthorId = contentDoc.author.toString();

    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // If the user is voting again with the same vote type, remove the vote
        await Vote.deleteOne({_id: existingVote._id}).session(session);
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: -1,
          },
          session,
        );
      } else {
        // If a user is changing their vote, update voteType and adjust counts
        await Vote.findByIdAndUpdate(
          existingVote._id,
          {voteType},
          {new: true, session},
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: existingVote.voteType,
            change: -1,
          },
          session,
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: 1,
          },
          session,
        );
      }
    } else {
      // First-time vote creation
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        {session},
      );
      await updateVoteCount(
        {
          targetId,
          targetType,
          voteType,
          change: 1,
        },
        session,
      );
    }

    // log the interaction
    after(async () => {
      await createInteraction({
        action: voteType,
        actionId: targetId,
        actionTarget: targetType,
        authorId: contentAuthorId,
      });
    });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(buildPath(ROUTES.QUESTION_BY_ID, {questionId: targetId}));

    return {success: true, data: undefined};
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error, "server");
  }
}

type THasVotedParams = z.infer<typeof schemaHasVoted>;

type THasVotedData = {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
};

export async function hasVoted(
  params: THasVotedParams,
): Promise<SuccessResponse<THasVotedData> | FailureResponse<THasVotedData>> {
  const validationResult = await action({
    params,
    schema: schemaHasVoted,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {targetId, targetType} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });

    if (!vote)
      return {
        success: false,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };

    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
