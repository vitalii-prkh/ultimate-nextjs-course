"use server";

import {z} from "zod";
import Answer from "@/db/answer.model";
import Question from "@/db/question.model";
import Tag from "@/db/tag.model";
import User from "@/db/user.model";
import {action} from "../handlers/action";
import {handleError} from "../handlers/error";
import {schemaGlobalSearch} from "../validations";

export async function globalSearch(params: z.infer<typeof schemaGlobalSearch>) {
  try {
    const validationResult = await action({
      params,
      schema: schemaGlobalSearch,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult, "server");
    }

    const {query, type} = params;
    const regexQuery = {$regex: query, $options: "i"};

    let results = [];

    const modelsAndTypes = [
      {model: Question, searchField: "title", type: "question"},
      {model: User, searchField: "name", type: "user"},
      {model: Answer, searchField: "content", type: "answer"},
      {model: Tag, searchField: "name", type: "tag"},
    ];

    const typeLower = type?.toLowerCase();
    const SearchableTypes = ["question", "answer", "user", "tag"];

    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // If no type is specified, search in all models
      for (const {model, searchField, type} of modelsAndTypes) {
        const queryResults = await model
          .find({[searchField]: regexQuery})
          .limit(2);

        results.push(
          ...queryResults.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id: type === "answer" ? item.question : item._id,
          })),
        );
      }
    } else {
      // Search in the specified model type
      const modelInfo = modelsAndTypes.find((item) => item.type === type);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({[modelInfo.searchField]: regexQuery})
        .limit(8);

      results = queryResults.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchField],
        type,
        id: type === "answer" ? item.question : item._id,
      }));
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
    };
  } catch (error) {
    return handleError(error, "server");
  }
}
