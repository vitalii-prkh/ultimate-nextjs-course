"use server";

import {FilterQuery} from "mongoose";
import {z} from "zod";
import Tag, {TTagJSON} from "@/db/tag.model";
import {FILTERS} from "@/refs/filters";
import {action} from "@/lib/handlers/action";
import {schemaSearchParams} from "@/lib/validations";
import {handleError} from "@/lib/handlers/error";
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
