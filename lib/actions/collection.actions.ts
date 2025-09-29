"use server";

import {PipelineStage, Types} from "mongoose";
import {revalidatePath} from "next/cache";
import {z} from "zod";
import Question, {TQuestionJSON} from "@/db/question.model";
import Collection, {TCollectionJSON} from "@/db/collection.model";
import {TUserJSON} from "@/db/user.model";
import {TTagJSON} from "@/db/tag.model";
import {ROUTES} from "@/refs/routes";
import {schemaCollectionBase, schemaSearchParams} from "@/lib/validations";
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

    if (!question) {
      throw new NotFoundError("Question");
    }

    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);

      revalidatePath(buildPath(ROUTES.QUESTION_BY_ID, {questionId}));

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

type THasSaveQuestionParams = z.infer<typeof schemaCollectionBase>;

type THasSaveQuestionData = {
  saved: boolean;
};

export async function hasSaveQuestion(
  params: THasSaveQuestionParams,
): Promise<SuccessResponse<THasSaveQuestionData> | FailureResponse> {
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
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        saved: Boolean(collection),
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetSavedQuestionsParams = z.infer<typeof schemaSearchParams>;

type TGetSavedQuestionsData = {
  isNext: boolean;
  data: TCollectionInList[];
};

type TCollectionInList = Omit<TCollectionJSON, "question"> & {
  question: Omit<TQuestionJSON, "author" | "tags"> & {
    author: TUserJSON;
    tags: TTagJSON[];
  };
};

export async function getSavedQuestions(
  params: TGetSavedQuestionsParams,
): Promise<SuccessResponse<TGetSavedQuestionsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaSearchParams,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const userId = validationResult.session?.user?.id;
  const {page = 1, pageSize = 10, query, filter} = validationResult.params!;
  const limit = Number(pageSize);
  const skip = (Number(page) - 1) * limit;
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: {"question.createdAt": -1},
    oldest: {"question.createdAt": 1},
    mostvoted: {"question.upvotes": -1},
    mostviewed: {"question.views": -1},
    mostanswered: {"question.answers": -1},
  };
  const sortCriteria =
    sortOptions[filter as keyof typeof sortOptions] || sortOptions.mostrecent;

  try {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          author: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      {
        $unwind: "$question",
      },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      {
        $unwind: "$question.author",
      },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            {"question.title": {$regex: query, $options: "i"}},
            {"question.content": {$regex: query, $options: "i"}},
          ],
        },
      });
    }

    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      {$count: "count"},
    ]);

    pipeline.push({$sort: sortCriteria}, {$skip: skip}, {$limit: limit});
    pipeline.push({$project: {question: 1, author: 1}});

    const questions = await Collection.aggregate(pipeline);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(questions)),
        isNext: totalCount.count > skip + questions.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
