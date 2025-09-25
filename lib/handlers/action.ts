"use server";

import {Session} from "next-auth";
import {z, ZodError} from "zod";
import {auth} from "@/auth";
import {UnauthorizedError, ValidationError} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: z.ZodType<T>;
  authorize?: boolean;
};

export async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const flattedErrors = z.flattenError(error).fieldErrors;

        return new ValidationError(flattedErrors);
      }

      return new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }
  }

  await dbConnect();

  return {params, session};
}
