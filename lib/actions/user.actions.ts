"use server";

import {FilterQuery} from "mongoose";
import {z} from "zod";
import User, {TUserJSON} from "@/db/user.model";
import Question from "@/db/question.model";
import Answer from "@/db/answer.model";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {schemaSearchParams, schemaGetUser} from "@/lib/validations";
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
