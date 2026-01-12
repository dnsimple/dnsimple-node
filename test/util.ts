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

function parseHeaders(lines: string[]): { [key: string]: string } {
  const headers: { [key: string]: string } = {};
  const separatorLineIndex = lines.findIndex((line) => line.trim() === "");

  // Start from line 1 (skip status line) to the separator
  for (let i = 1; i < separatorLineIndex; i++) {
    const colonIndex = lines[i].indexOf(":");
    if (colonIndex > 0) {
      const key = lines[i].slice(0, colonIndex).trim();
      const value = lines[i].slice(colonIndex + 1).trim();
      headers[key] = value;
    }
  }

  return headers;
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
  headers?: { [key: string]: string };
  body?: string[];
} {
  const data = readFileSync(`${__dirname}/fixtures.http/${path}`, "utf-8");
  const lines = data.split(/\r?\n/);

  const status = parseStatusCode(lines);
  const headers = parseHeaders(lines);

  if (status === 204) return { status: 204, headers };

  return { status: status, headers, body: parseBody(lines) };
}
