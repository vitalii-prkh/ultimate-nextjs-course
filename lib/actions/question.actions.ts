"use server";

import mongoose, {FilterQuery, Types} from "mongoose";
import {z} from "zod";
import Question, {TQuestionHydrated, TQuestionJSON} from "@/db/question.model";
import Tag, {TTagHydrated, TTagJSON} from "@/db/tag.model";
import TagQuestion, {TTagQuestionData} from "@/db/tag-question.model";
import {TUserJSON} from "@/db/user.model";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {
  schemaAskQuestion,
  schemaUpdateQuestion,
  schemaGetQuestion,
  schemaSearchParams,
} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {FailureResponse, SuccessResponse} from "@/types/global";

type TPostQuestionParams = Pick<TQuestionJSON, "title" | "content" | "tags">;

export async function createQuestion(
  params: TPostQuestionParams,
): Promise<SuccessResponse<TQuestionJSON> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaAskQuestion,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {title, content, tags} = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{title, content, author: userId}],
      {
        session,
      },
    );

    if (!question) {
      throw new Error("Failed to create questions");
    }

    const tagIds: Types.ObjectId[] = [];
    const tagQuestionDocuments: TTagQuestionData[] = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {name: {$regex: new RegExp(`^${tag}$`, "i")}},
        {$setOnInsert: {name: tag}, $inc: {questions: 1}},
        {upsert: true, new: true, session},
      );

      tagIds.push(existingTag._id);
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, {session});
    await Question.findByIdAndUpdate(
      question._id,
      {$push: {tags: {$each: tagIds}}},
      {session},
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error, "server");
  } finally {
    await session.endSession();
  }
}

type TPutQuestionParams = Pick<
  TQuestionJSON,
  "title" | "content" | "tags" | "_id"
>;

type TPutQuestionData = Omit<TQuestionJSON, "tags"> & {
  tags: TTagJSON[];
};

export async function updateQuestion(
  params: TPutQuestionParams,
): Promise<SuccessResponse<TPutQuestionData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaUpdateQuestion,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {_id, title, content, tags} = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    type TQuestionPopulated = Omit<TQuestionHydrated, "tags"> & {
      tags: TTagHydrated[];
    };

    const question =
      await Question.findById<TQuestionPopulated>(_id).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;

      await question.save({session});
    }

    const tagsToAdd = tags.filter(
      (tag) =>
        !question.tags.some((t) => t.name.toLowerCase() === tag.toLowerCase()),
    );
    const tagsToRemove = question.tags.filter(
      (tag) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()),
    );
    const newTagDocuments = [];

    if (tagsToAdd.length) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          {name: {$regex: new RegExp(`^${tag}$`, "i")}},
          {$setOnInsert: {name: tag}, $inc: {questions: 1}},
          {upsert: true, new: true, session},
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });

          (question as unknown as TQuestionHydrated).tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length) {
      const tagIdsToRemove = tagsToRemove.map((tag) => tag._id);

      await Tag.updateMany(
        {_id: {$in: tagIdsToRemove}},
        {$inc: {questions: -1}},
        {session},
      );
      await TagQuestion.deleteMany(
        {tag: {$in: tagIdsToRemove}, question: question._id},
        {session},
      );

      question.tags = question.tags.filter(
        (tag) => !tagIdsToRemove.some((tagId) => tagId.equals(tag._id)),
      );
    }

    if (newTagDocuments.length) {
      await TagQuestion.insertMany(newTagDocuments, {session});
    }

    await question.save({session});
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error, "server");
  } finally {
    await session.endSession();
  }
}

type TGetQuestionParams = {
  questionId: string;
};

type TGetQuestionData = Omit<TQuestionJSON, "tags" | "author"> & {
  tags: TTagJSON[];
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getQuestion(
  params: TGetQuestionParams,
): Promise<SuccessResponse<TGetQuestionData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetQuestion,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {questionId} = validationResult.params!;

  try {
    const question = await Question.findById(questionId)
      .populate("tags")
      .populate("author", "name image");

    if (!question) {
      throw new Error("Question not found");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetQuestionsParams = z.infer<typeof schemaSearchParams>;

type TGetQuestionsData = {
  data: TQuestionInList[];
  isNext: boolean;
};

export type TQuestionInList = Omit<TQuestionJSON, "tags" | "author"> & {
  tags: Pick<TTagJSON, "_id" | "name">[];
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getQuestions(
  params: TGetQuestionsParams,
): Promise<SuccessResponse<TGetQuestionsData> | FailureResponse> {
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
  const filterQuery: FilterQuery<typeof Question> = {};

  if (filter === FILTERS.RECOMMENDED) {
    return {
      success: true,
      data: {
        data: [],
        isNext: false,
      },
    };
  }

  if (query) {
    filterQuery.$or = [
      {title: {$regex: query, $options: "i"}},
      {content: {$regex: query, $options: "i"}},
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case FILTERS.NEWEST:
      sortCriteria = {createdAt: -1};
      break;
    case FILTERS.UNANSWERED:
      filterQuery.answers = 0;
      sortCriteria = {createdAt: -1};
      break;
    case FILTERS.POPULAR:
      sortCriteria = {upvotes: -1};
      break;
    default:
      sortCriteria = {createdAt: -1};
  }

  try {
    const totalQuestions = await Question.countDocuments(filterQuery);
    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(questions)),
        isNext: totalQuestions > skip + questions.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
