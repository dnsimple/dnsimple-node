import * as fs from "node:fs";
import * as sinon from "sinon";
import { DNSimple } from "../lib/main";

export const getAccessToken = () => process.env["TOKEN"] ?? "bogus";

export const createTestClient = () =>
  new DNSimple({
    accessToken: getAccessToken(),
  });

export const stubRequest = (client: DNSimple) => {
  const stub = sinon.stub();
  client.request = stub;
  return stub;
};

export const loadFixture = (path: string) => {
  const data = fs.readFileSync(`${__dirname}/fixtures.http/${path}`, "utf-8");
  const lines = data.split(/\r?\n/);

  const statusLine = lines.shift()!;
  const statusParts = statusLine.split(/\s+/);
  const httpVersion = statusParts[0];
  const statusCode = Number.parseInt(statusParts[1], 10);
  const reasonPhrase = statusParts[2];

  const headers: { [name: string]: string } = {};
  let val;
  while ((val = lines.shift())) {
    const pair = val.split(/:\s/);
    headers[pair[0]] = pair[1];
  }

  const fixture = {
    httpVersion,
    statusCode,
    headers,
    reasonPhrase,
    body:
      statusCode === 204
        ? null
        : headers["Content-Type"] === "application/json"
        ? JSON.parse(lines.join("\n"))
        : lines.join("\n"),
  };

  return fixture;
};
