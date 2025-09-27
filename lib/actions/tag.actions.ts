"use server";

import {FilterQuery} from "mongoose";
import {z} from "zod";
import Question, {TQuestionJSON} from "@/db/question.model";
import Tag, {TTagJSON} from "@/db/tag.model";
import {TUserJSON} from "@/db/user.model";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {
  schemaSearchParams,
  schemaSearchTagQuestionsParams,
} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {NotFoundError} from "@/lib/http-errors";
import {SuccessResponse, FailureResponse} from "@/types/global";

type TGetTagsParams = z.infer<typeof schemaSearchParams>;

type TGetTagsData = {
  data: TTagJSON[];
  isNext: boolean;
};

export async function getTags(
  params: TGetTagsParams,
): Promise<SuccessResponse<TGetTagsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaSearchParams,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {page = 1, pageSize = 10, query, filter} = validationResult.params!;
  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;
  const filterQuery: FilterQuery<typeof Tag> = {};

  if (query) {
    filterQuery.$or = [{name: {$regex: query, $options: "i"}}];
  }

  let sortCriteria = {};

  switch (filter) {
    case FILTERS.POPULAR:
      sortCriteria = {questions: -1};
      break;
    case FILTERS.RECENT:
      sortCriteria = {createdAt: -1};
      break;
    case FILTERS.OLDEST:
      sortCriteria = {createdAt: 1};
      break;
    case FILTERS.NAME:
      sortCriteria = {name: 1};
      break;
    default:
      sortCriteria = {questions: 1};
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(tags)),
        isNext: totalTags > skip + tags.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetTagQuestionsParams = Omit<
  z.infer<typeof schemaSearchTagQuestionsParams>,
  "filter"
>;

type TGetTagQuestionsData = {
  tag: TTagJSON;
  data: TTagQuestionInList[];
  isNext: boolean;
};

export type TTagQuestionInList = Omit<
  Pick<
    TQuestionJSON,
    | "_id"
    | "title"
    | "views"
    | "answers"
    | "upvotes"
    | "downvotes"
    | "author"
    | "createdAt"
  >,
  "tags" | "author"
> & {
  tags: Pick<TTagJSON, "_id" | "name">[];
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getTagQuestions(
  params: TGetTagQuestionsParams,
): Promise<SuccessResponse<TGetTagQuestionsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaSearchTagQuestionsParams,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {page = 1, pageSize = 10, query, tagId} = validationResult.params!;
  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;

  try {
    const tag = await Tag.findById(tagId);

    if (!tag) {
      throw new NotFoundError("Tag");
    }

    const filterQuery: FilterQuery<typeof Question> = {tags: {$in: [tagId]}};

    if (query) {
      filterQuery.title = {$regex: query, $options: "i"};
    }

    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        {path: "author", select: "name image"},
        {path: "tags", select: "name"},
      ])
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        data: JSON.parse(JSON.stringify(questions)),
        isNext: totalQuestions > skip + questions.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
