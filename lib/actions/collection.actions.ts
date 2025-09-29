"use server";

import {revalidatePath} from "next/cache";
import {z} from "zod";
import Question from "@/db/question.model";
import Collection from "@/db/collection.model";
import {ROUTES} from "@/refs/routes";
import {schemaCollectionBase} from "@/lib/validations";
import {action} from "@/lib/handlers/action";
import {handleError} from "@/lib/handlers/error";
import {buildPath} from "@/lib/path/buildPath";
import {NotFoundError} from "@/lib/http-errors";
import {SuccessResponse, FailureResponse} from "@/types/global";

type TToggleSaveQuestionParams = z.infer<typeof schemaCollectionBase>;
type TToggleSaveQuestionData = {
  saved: boolean;
};

export async function toggleSaveQuestion(
  params: TToggleSaveQuestionParams,
): Promise<SuccessResponse<TToggleSaveQuestionData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaCollectionBase,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {questionId} = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId);

    if (question) {
      throw new NotFoundError("Question");
    }

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection.id);

      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }

    await Collection.create({
      question: questionId,
      author: userId,
    });

    revalidatePath(buildPath(ROUTES.QUESTION_BY_ID, {questionId}));

    return {
      success: true,
      data: {
        saved: true,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
