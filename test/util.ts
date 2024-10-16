import { readFileSync } from "fs";
import fetchFetcher from "../lib/fetcher/fetch-fetcher";
import { DNSimple } from "../lib/main";

function hasJsonContent(lines: string[]) {
  for (let line of lines) {
    const [key, value] = line.split(/:\s/);
    if (
      key.toLowerCase() === "content-type" &&
      value.includes("application/json")
    )
      return true;
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
    fetcher: fetchFetcher,
  });
}

export function responseFromFixture(path: string): {
  status: number;
  body?: string[];
} {
  const data = readFileSync(`${__dirname}/fixtures.http/${path}`, "utf-8");
  const lines = data.split(/\r?\n/);

  const status = parseStatusCode(lines);
  if (status === 204) return { status: 204 };

  return { status: status, body: parseBody(lines) };
}
