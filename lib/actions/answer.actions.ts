"use server";

import mongoose from "mongoose";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import Question from "@/db/question.model";
import Answer, {TAnswerJSON} from "@/db/answer.model";
import {ROUTES} from "@/refs/routes";
import {action} from "@/lib/handlers/action";
import {schemaAnswerAction} from "@/lib/validations";
import {buildPath} from "@/lib/path/buildPath";
import {handleError} from "@/lib/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import {FailureResponse, SuccessResponse} from "@/types/global";

type TCreateAnswersParams = z.infer<typeof schemaAnswerAction>;

export async function createAnswer(
  params: TCreateAnswersParams,
): Promise<SuccessResponse<TAnswerJSON> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaAnswerAction,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {content, questionId} = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new NotFoundError("Question");
    }

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          question: questionId,
          content,
        },
      ],
      {session},
    );

    if (!newAnswer) {
      throw new Error("Failed to create answer");
    }

    question.answers += 1;

    await question.save({session});
    await session.commitTransaction();

    revalidatePath(buildPath(ROUTES.QUESTION_BY_ID, {questionId}));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "server");
  } finally {
    await session.endSession();
  }
}
