"use server";

import mongoose, {FilterQuery, Types} from "mongoose";
import {z} from "zod";
import {revalidatePath} from "next/cache";
import {after} from "next/server";
import {auth} from "@/auth";
import Question, {TQuestionHydrated, TQuestionJSON} from "@/db/question.model";
import Tag, {TTagHydrated, TTagJSON} from "@/db/tag.model";
import TagQuestion, {TTagQuestionData} from "@/db/tag-question.model";
import Collection from "@/db/collection.model";
import Vote from "@/db/vote.model";
import Answer from "@/db/answer.model";
import Interaction from "@/db/interaction.model";
import {TUserJSON} from "@/db/user.model";
import {FILTERS} from "@/refs/filters";
import {ROUTES} from "@/refs/routes";
import {action} from "@/lib/handlers/action";
import {createInteraction} from "@/lib/actions/interaction.actions";
import dbConnect from "@/lib/mongoose";
import {
  schemaAskQuestion,
  schemaUpdateQuestion,
  schemaGetQuestion,
  schemaSearchParams,
  schemaIncrementViews,
  schemaDeleteQuestion,
} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {FailureResponse, SuccessResponse} from "@/types/global";
import {NotFoundError} from "@/lib/http-errors";
import {buildPath} from "@/lib/path/buildPath";

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

    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionTarget: "question",
        authorId: userId!,
      });
    });

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

  try {
    if (filter === FILTERS.RECOMMENDED) {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return {
          success: true,
          data: {
            data: [],
            isNext: false,
          },
        };
      }

      return await getRecommendedQuestions({
        userId,
        query,
        skip,
        limit,
      });
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

type TIncrementViewsParams = z.infer<typeof schemaIncrementViews>;

type TIncrementViewsData = Pick<TQuestionJSON, "views">;

export async function incrementViews(
  params: TIncrementViewsParams,
): Promise<SuccessResponse<TIncrementViewsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaIncrementViews,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {questionId} = validationResult.params!;

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new NotFoundError("Question");
    }

    question.views += 1;

    await question.save();

    return {
      success: true,
      data: {
        views: question.views,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

export async function getHotQuestions(): Promise<
  SuccessResponse<TQuestionJSON[]> | FailureResponse
> {
  try {
    await dbConnect();

    const questions = await Question.find()
      .sort({views: -1, upvotes: -1})
      .limit(5);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

export async function deleteQuestion(
  params: z.infer<typeof schemaDeleteQuestion>,
): Promise<SuccessResponse | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaDeleteQuestion,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {questionId} = validationResult.params!;
  const {user} = validationResult.session!;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== user?.id) {
      throw new Error("You are not authorized to delete this question");
    }

    // Delete related entries inside the transaction
    await Collection.deleteMany({question: questionId}).session(session);
    await TagQuestion.deleteMany({question: questionId}).session(session);

    // For all tags of Question, find them and reduce their count
    if (question.tags.length > 0) {
      await Tag.updateMany(
        {
          _id: {
            $in: question.tags,
          },
        },
        {
          $inc: {
            questions: -1,
          },
        },
        {session},
      );
    }

    //  Remove all votes of the question
    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    // Remove all answers and their votes of the question
    const answers = await Answer.find({question: questionId}).session(session);

    if (answers.length > 0) {
      await Answer.deleteMany({question: questionId}).session(session);

      await Vote.deleteMany({
        actionId: {
          $in: answers.map((answer) => answer.id),
        },
        actionType: "answer",
      }).session(session);
    }

    await Question.findByIdAndDelete(questionId).session(session);

    // log the interaction
    after(async () => {
      await createInteraction({
        action: "delete",
        actionId: questionId,
        actionTarget: "question",
        authorId: user?.id as string,
      });
    });

    await session.commitTransaction();

    session.endSession();

    revalidatePath(buildPath(ROUTES.PROFILE_BY_ID, {profileId: user?.id}));

    return {
      success: true,
      data: undefined,
    };
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    return handleError(error, "server");
  }
}

type TGetRecommendedQuestionsParams = {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
};

type TGetRecommendedQuestionsData = {
  data: TQuestionInList[];
  isNext: boolean;
};

export async function getRecommendedQuestions(
  params: TGetRecommendedQuestionsParams,
): Promise<SuccessResponse<TGetRecommendedQuestionsData> | FailureResponse> {
  const {userId, query, skip, limit} = params;
  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "question",
    action: {
      $in: ["view", "upvote", "bookmark", "post"],
    },
  })
    .sort({createdAt: -1})
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map((i) => i.actionId);
  const interactedQuestions = await Question.find<TQuestionHydrated>({
    _id: {
      $in: interactedQuestionIds,
    },
  }).select("tags");

  const allTags = interactedQuestions.flatMap((q) =>
    q.tags.map((tag: Types.ObjectId) => tag.toString()),
  );

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: FilterQuery<typeof Question> = {
    _id: {
      $nin: interactedQuestionIds,
    },
    author: {
      $ne: new Types.ObjectId(userId),
    },
    tags: {
      $in: uniqueTagIds.map((id) => new Types.ObjectId(id)),
    },
  };

  if (query) {
    recommendedQuery.$or = [
      {title: {$regex: query, $options: "i"}},
      {content: {$regex: query, $options: "i"}},
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({upvotes: -1, views: -1})
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    success: true,
    data: {
      data: JSON.parse(JSON.stringify(questions)),
      isNext: total > skip + questions.length,
    },
  };
}
