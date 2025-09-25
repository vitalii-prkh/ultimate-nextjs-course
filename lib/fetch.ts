import {ActionResponse} from "@/types/global";
import {log} from "@/lib/log";
import {handleError} from "@/lib/handlers/error";
import {RequestError} from "@/lib/http-errors";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {timeout = 5000, headers: customHeaders = {}, ...restOptions} = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...customHeaders,
  };
  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    const error = isError(e) ? e : new Error("Unknown error");

    if (error.name === "AbortError") {
      log.warn(`Request to "${url}" timed out`);
    } else {
      log.error(`Error fetching "${url}": ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}
