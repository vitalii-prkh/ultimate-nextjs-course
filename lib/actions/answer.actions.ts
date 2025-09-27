"use server";

import mongoose, {FilterQuery} from "mongoose";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import Question from "@/db/question.model";
import Answer, {TAnswerJSON} from "@/db/answer.model";
import {TUserJSON} from "@/db/user.model";
import {ROUTES} from "@/refs/routes";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {schemaAnswerAction, schemaGetAnswers} from "@/lib/validations";
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

type TGetAnswersParams = z.infer<typeof schemaGetAnswers>;

type TGetAnswersData = {
  data: TAnswerInList[];
  total: number;
  isNext: boolean;
};

export type TAnswerInList = Omit<TAnswerJSON, "author"> & {
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getAnswers(
  params: TGetAnswersParams,
): Promise<SuccessResponse<TGetAnswersData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetAnswers,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {
    page = 1,
    pageSize = 10,
    filter,
    questionId,
  } = validationResult.params!;
  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;
  const filterQuery: FilterQuery<typeof Answer> = {question: questionId};

  let sortCriteria = {};

  switch (filter) {
    case FILTERS.NEWEST:
      sortCriteria = {createdAt: -1};
      break;
    case FILTERS.OLDEST:
      sortCriteria = {createdAt: 1};
      break;
    case FILTERS.POPULAR:
      sortCriteria = {upvotes: -1};
      break;
    default:
      sortCriteria = {createdAt: -1};
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments(filterQuery);
    const answers = await Answer.find(filterQuery)
      .populate("author", "name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(answers)),
        total: totalAnswers,
        isNext: totalAnswers > skip + answers.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
