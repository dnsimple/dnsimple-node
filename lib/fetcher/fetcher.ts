/**
 * A function that makes an HTTP request. It's responsible for throwing {@link TimeoutError} and aborting the request on {@param params.timeout}.
 * It should return the response status and full body as a string. It should not throw on any status, even if 4xx or 5xx.
 * It can decide to implement retries as appropriate. The default fetcher currently does not implement any retry strategy.
 */
export type Fetcher = (params: {
  method: string;
  url: string;
  headers: { [name: string]: string };
  body?: string;
  // Since Node.js 14 doesn't support AbortController, we cannot simply provide the AbortSignal directly. We should move to that once we drop support for Node.js 14.
  timeout: number;
}) => Promise<{
  status: number;
  body: string;
}>;
