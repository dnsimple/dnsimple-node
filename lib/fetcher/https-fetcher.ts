import * as https from "https";
import { URL } from "url";
import type { Fetcher } from "./fetcher";
import { TimeoutError } from "../main";

const httpsFetcher: Fetcher = (params: {
  method: string;
  url: string;
  headers: { [name: string]: string };
  timeout: number;
  body?: string;
}): Promise<{ status: number; body: string }> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(params.url);
    const options: https.RequestOptions = {
      method: params.method,
      headers: params.headers,
      timeout: params.timeout,
    };

    const req = https.request(urlObj, options, (res) => {
      const chunks: Buffer[] = [];
      res
        .on("data", (chunk) => chunks.push(chunk))
        .on("end", () => {
          const body = Buffer.concat(chunks).toString("utf-8");
          resolve({
            status: res.statusCode || 500, // Fallback to 500 if statusCode is undefined
            body: body,
          });
        });
    });

    req.on("error", (err: { code?: string }) => {
      if (err.code === "ECONNRESET") reject(new TimeoutError());
      else reject(err);
    });

    const timeoutId = setTimeout(() => {
      req.destroy();
      reject(new TimeoutError());
    }, params.timeout);

    req.on("close", () => clearTimeout(timeoutId));

    if (params.body) req.write(params.body);

    req.end();
  });
};

export default httpsFetcher;