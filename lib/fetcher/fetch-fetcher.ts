import { DNSimple, TimeoutError } from "../main";
import type { Fetcher } from "./fetcher";

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
    return { status: response.status, body: await response.text() };
  } catch (error) {
    if (abortController && abortController.signal.aborted)
      throw new TimeoutError();

    throw error;
  }
};

export default fetchFetcher;