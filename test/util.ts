import { readFileSync } from "fs";
import { DNSimple, TimeoutError } from "../lib/main";

function hasJsonContent(lines: string[]) {
  for (let line of lines) {
    const [key, value] = line.split(/:\s/);
    if (key.toLowerCase() === "content-type" && value.includes("application/json")) return true;
  }
  return false;
}

function parseStatusCode(lines: string[]) {
  return parseInt(lines[0].split(/\s+/)[1], 10);
}

function parseBody(lines: string[]) {
  const separatorLineIndex = lines.findIndex((line) => line.trim() === "");

  const rawBody = lines
    .slice(separatorLineIndex + 1)
    .join("\n")
    .trim();

  if (hasJsonContent(lines) && rawBody !== "") return JSON.parse(rawBody);

  return rawBody;
}

export function createTestClient() {
  return new DNSimple({
    accessToken: process.env["TOKEN"] ?? "bogus",
    fetcher: async (params: {
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
        if (abortController && abortController.signal.aborted) throw new TimeoutError();

        throw error;
      }
    },
  });
}

export function readFixtureAt(path: string): () => [number, string] {
  const data = readFileSync(`${__dirname}/fixtures.http/${path}`, "utf-8");
  const lines = data.split(/\r?\n/);

  const statusCode = parseStatusCode(lines);
  if (statusCode === 204) return () => [204, ""];

  return () => [statusCode, parseBody(lines)];
}

export const fetchMockResponse = (fixturePath: string) => {
  const [status, body] = readFixtureAt(fixturePath)();
  if (status === 204) return { status: 204 };

  return { status, body };
};
