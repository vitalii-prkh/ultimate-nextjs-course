"use server";

import mongoose, {Types} from "mongoose";
import Question, {TQuestionJSON} from "@/db/question.model";
import Tag, {TTagData} from "@/db/tag.model";
import TagQuestion, {TTagQuestionData} from "@/db/tag-question.model";
import {action} from "@/lib/handlers/action";
import {
  schemaAskQuestion,
  schemaUpdateQuestion,
  schemaGetQuestion,
} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {FailureResponse, SuccessResponse} from "@/types/global";

export async function createQuestion(
  params: Pick<TQuestionJSON, "title" | "content" | "tags">,
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
      const existingTag = await Tag.findOneAndUpdate<TTagData>(
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

export async function updateQuestion(
  params: Pick<TQuestionJSON, "title" | "content" | "tags" | "_id">,
): Promise<SuccessResponse<TQuestionJSON> | FailureResponse> {
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
    const question = await Question.findById(_id).populate("tags");

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
        !question.tags.some(
          (t: TTagData) => t.name.toLowerCase() === tag.toLowerCase(),
        ),
    );
    const tagsToRemove = question.tags.filter(
      (tag: TTagData) =>
        !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase()),
    );
    const newTagDocuments = [];

    if (tagsToAdd.length) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate<TTagData>(
          {name: {$regex: new RegExp(`^${tag}$`, "i")}},
          {$setOnInsert: {name: tag}, $inc: {questions: 1}},
          {upsert: true, new: true, session},
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: question._id,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length) {
      const tagIdsToRemove = tagsToRemove.map((tag: TTagData) => tag._id);

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
        (tag: Types.ObjectId) =>
          !tagIdsToRemove.some((tagId: Types.ObjectId) =>
            tagId.equals(tag._id),
          ),
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

export async function getQuestion(params: {questionId: string}): Promise<
  | SuccessResponse<
      Omit<TQuestionJSON, "tags"> & {
        tags: {_id: string; name: string}[];
      }
    >
  | FailureResponse
> {
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
    const question = await Question.findById(questionId).populate("tags");

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
