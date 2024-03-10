import * as fs from "fs";
import type { ReplyFnResult } from "nock/types";
import { DNSimple } from "../lib/main";

export const createTestClient = () =>
  new DNSimple({
    accessToken: process.env["TOKEN"] ?? "bogus",
  });

export function readFixtureAt(path: string): () => ReplyFnResult {
  const data = fs.readFileSync(`${__dirname}/fixtures.http/${path}`, "utf-8");
  const lines = data.split(/\r?\n/);

  const statusLine = lines.shift()!;
  const statusParts = statusLine.split(/\s+/);
  const statusCode = Number.parseInt(statusParts[1], 10);

  const headers: { [name: string]: string } = {};
  let val;
  while ((val = lines.shift())) {
    const pair = val.split(/:\s/);
    headers[pair[0]] = pair[1];
  }

  if (statusCode === 204) return () => [204, ""];

  if (headers["Content-Type"] === "application/json")
    return () => [statusCode, JSON.parse(lines.join("\n"))];

  return () => [statusCode, lines.join("\n")];
}
