import type { RateLimitHeaders } from "../types";

/**
 * A function that makes an HTTP request. It's responsible for throwing {@link TimeoutError} and aborting the request on {@param params.timeout}.
 * It should return the response status, full body as a string, and rate limit headers. It should not throw on any status, even if 4xx or 5xx.
 * It can decide to implement retries as appropriate. The default fetcher currently does not implement any retry strategy.
 */
export type Fetcher = (params: {
  method: string;
  url: string;
  headers: { [name: string]: string };
  body?: string;
  timeout: number;
}) => Promise<{
  status: number;
  body: string;
  rateLimit: RateLimitHeaders;
}>;

let fetcherImports: {
  fetchFetcher: Fetcher;
  httpsFetcher: Fetcher;
};
let fetcherImportError: Error | undefined;

try {
  fetcherImports = {
    fetchFetcher: require("./fetch-fetcher").default,
    httpsFetcher: require("./https-fetcher").default,
  };
} catch (error) {
  fetcherImportError = error;
}

export function getRuntimeFetcher(): Fetcher {
  if (fetcherImportError)
    throw new Error(
      `No global \`fetch\` or \`https\` module was found. Please, provide a Fetcher implementation: ${fetcherImportError}`
    );

  return typeof fetch === "undefined"
    ? fetcherImports.httpsFetcher
    : fetcherImports.fetchFetcher;
}
