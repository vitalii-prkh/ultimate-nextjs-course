"use server";

import mongoose, {ObjectIdToString, Types} from "mongoose";
import Question, {TQuestionType, TQuestionJSON} from "@/db/question.model";
import Tag, {TTagData} from "@/db/tag.model";
import TagQuestion, {TTagQuestionData} from "@/db/tag-question.model";
import {action} from "@/lib/handlers/action";
import {schemaAskQuestion} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {FailureResponse, SuccessResponse} from "@/types/global";

export async function createQuestion(
  params: ObjectIdToString<Pick<TQuestionType, "title" | "content" | "tags">>,
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
