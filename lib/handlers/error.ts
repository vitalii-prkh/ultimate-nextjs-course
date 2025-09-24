import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {RequestError, ValidationError} from "@/lib/http-errors";
import {log} from "@/lib/log";

export type ResponseType = "api" | "server";

export function handleError(
  error: unknown,
  responseType: ResponseType = "server",
) {
  if (error instanceof RequestError) {
    log.error(
      {err: error},
      `${responseType.toUpperCase()} Error: ${error.message}`,
    );

    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors,
    );
  }

  if (error instanceof ZodError) {
    const flattedErrors = z.flattenError(error).fieldErrors;
    const validationError = new ValidationError(flattedErrors);

    log.error({err: error}, `Validation Error: ${error.message}`);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    log.error(error.message);

    return formatResponse(responseType, 500, error.message);
  }

  log.error({err: error}, "An unexpected error occurred");

  return formatResponse(responseType, 500, "An unexpected error occurred");
}

function formatResponse(
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]>,
) {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, {status})
    : {status, ...responseContent};
}
