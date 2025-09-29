"use server";

import {FilterQuery, PipelineStage, Types} from "mongoose";
import {z} from "zod";
import User, {TUserJSON} from "@/db/user.model";
import Question, {TQuestionJSON} from "@/db/question.model";
import Answer, {TAnswerJSON} from "@/db/answer.model";
import {TTagJSON} from "@/db/tag.model";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {
  schemaSearchParams,
  schemaGetUser,
  schemaGetUserQuestions,
  schemaGetUserAnswers,
  schemaGetUserTags,
} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
import {FailureResponse, SuccessResponse} from "@/types/global";
import {NotFoundError} from "@/lib/http-errors";

type TGetUsersParams = z.infer<typeof schemaSearchParams>;

export type TGetUsersData = {
  data: TUserJSON[];
  total: number;
  isNext: boolean;
};

export async function getUsers(
  params: TGetUsersParams,
): Promise<SuccessResponse<TGetUsersData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaSearchParams,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {page = 1, pageSize = 10, filter, query} = validationResult.params!;
  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;
  const filterQuery: FilterQuery<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      {name: {$regex: query, $options: "i"}},
      {email: {$regex: query, $options: "i"}},
    ];
  }

  let sortCriteria = {};

  switch (filter) {
    case FILTERS.NEWEST:
      sortCriteria = {createdAt: -1};
      break;
    case FILTERS.OLDEST:
      sortCriteria = {createdAt: 1};
      break;
    case FILTERS.POPULAR:
      sortCriteria = {reputation: -1};
      break;
    default:
      sortCriteria = {createdAt: -1};
      break;
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery);
    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(users)),
        total: totalUsers,
        isNext: totalUsers > skip + users.length,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetUserParams = z.infer<typeof schemaGetUser>;

type TGetUserData = {
  user: TUserJSON;
  totalQuestions: number;
  totalAnswers: number;
};

export async function getUser(
  params: TGetUserParams,
): Promise<SuccessResponse<TGetUserData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetUser,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {userId} = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("User");
    }

    const totalQuestions = await Question.countDocuments({author: userId});
    const totalAnswers = await Answer.countDocuments({author: userId});

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetUserQuestionsParams = z.infer<typeof schemaGetUserQuestions>;

type TGetUserQuestionsData = {
  isNext: boolean;
  data: TQuestionInList[];
};

export type TQuestionInList = Omit<TQuestionJSON, "tags" | "author"> & {
  tags: Pick<TTagJSON, "_id" | "name">[];
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getUserQuestions(
  params: TGetUserQuestionsParams,
): Promise<SuccessResponse<TGetUserQuestionsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetUserQuestions,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {userId, page = 1, pageSize = 10} = validationResult.params!;

  if (!userId) {
    throw new NotFoundError("User");
  }

  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;

  try {
    const totalQuestions = await Question.countDocuments({author: userId});
    const questions = await Question.find({author: userId})
      .populate("tags", "name")
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        isNext: totalQuestions > skip + questions.length,
        data: JSON.parse(JSON.stringify(questions)),
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetUserAnswerParams = z.infer<typeof schemaGetUserAnswers>;

type TGetUserAnswersData = {
  isNext: boolean;
  data: TAnswerInList[];
};

export type TAnswerInList = Omit<TAnswerJSON, "author"> & {
  author: Pick<TUserJSON, "_id" | "name" | "image">;
};

export async function getUserAnswers(
  params: TGetUserAnswerParams,
): Promise<SuccessResponse<TGetUserAnswersData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetUserAnswers,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {userId, page = 1, pageSize = 10} = validationResult.params!;

  if (!userId) {
    throw new NotFoundError("User");
  }

  const index = Number(page) - 1;
  const limit = Number(pageSize);
  const skip = Number(index) * limit;

  try {
    const totalQuestions = await Answer.countDocuments({author: userId});
    const questions = await Answer.find({author: userId})
      .populate("author", "name image")
      .skip(skip)
      .limit(limit);

    return {
      success: true,
      data: {
        isNext: totalQuestions > skip + questions.length,
        data: JSON.parse(JSON.stringify(questions)),
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

type TGetUserTopTagsParams = z.infer<typeof schemaGetUserTags>;

type TGetUserTopTagsData = {
  data: TGetUserTopTagInList[];
};

type TGetUserTopTagInList = {
  _id: string;
  name: string;
  count: number;
};

export async function getUserTopTags(
  params: TGetUserTopTagsParams,
): Promise<SuccessResponse<TGetUserTopTagsData> | FailureResponse> {
  const validationResult = await action({
    params,
    schema: schemaGetUserTags,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult, "server");
  }

  const {userId} = params;

  try {
    const pipeline: PipelineStage[] = [
      // Find user's questions
      {
        $match: {
          author: new Types.ObjectId(userId),
        },
      },
      // Flatten tags array
      {
        $unwind: "$tags",
      },
      // Count occurrences
      {
        $group: {
          _id: "$tags",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      {
        $unwind: "$tagInfo",
      },
      // Sort by most used
      {
        $sort: {
          count: -1,
        },
      },
      // Get top 10
      {
        $limit: 10,
      },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];

    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {
        data: JSON.parse(JSON.stringify(tags)),
      },
    };
  } catch (error) {
    return handleError(error, "server");
  }
}

export async function getUserStats() {
  return Promise.resolve({
    success: true,
    data: {
      isNext: false,
      data: [],
    },
    error: undefined,
  });
}
