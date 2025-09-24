export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);

    super(400, message, fieldErrors);

    this.errors = fieldErrors;
    this.name = "RequestError";
  }

  static formatFieldErrors(errors: Record<string, string[]>) {
    const formatedMessages = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

      return messages[0] === "Required"
        ? `${fieldName} is required`
        : messages.join(" and ");
    });

    return formatedMessages.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
