import { DNSimple, TimeoutError } from "../main";
import type { Fetcher, RateLimitHeaders } from "./fetcher";

function parseRateLimitHeaders(headers: Headers): RateLimitHeaders {
  const parseHeader = (name: string): number | null => {
    const value = headers.get(name);
    if (value === null) return null;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : parsed;
  };

  return {
    limit: parseHeader("x-ratelimit-limit"),
    remaining: parseHeader("x-ratelimit-remaining"),
    reset: parseHeader("x-ratelimit-reset"),
  };
}

const fetchFetcher: Fetcher = async (params: {
  method: string;
  url: string;
  headers: { [name: string]: string };
  timeout: number;
  body?: string;
}) => {
  const abortController = new AbortController();
  setTimeout(() => abortController.abort(), DNSimple.DEFAULT_TIMEOUT);
  try {
    const response = await fetch(params.url, {
      method: params.method,
      headers: params.headers,
      body: params.body,
      signal: abortController.signal,
    });
    return {
      status: response.status,
      body: await response.text(),
      rateLimit: parseRateLimitHeaders(response.headers),
    };
  } catch (error) {
    if (abortController && abortController.signal.aborted)
      throw new TimeoutError();

    throw error;
  }
};

export default fetchFetcher;
