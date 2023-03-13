import * as pkg from "../package.json";
import { Accounts } from "./accounts";
import { Certificates } from "./certificates";
import { Collaborators } from "./collaborators";
import { Contacts } from "./contacts";
import { Domains } from "./domains";
import { Identity } from "./identity";
import { OAuth } from "./oauth";
import { Registrar } from "./registrar";
import { Services } from "./services";
import { Templates } from "./templates";
import { Tlds } from "./tlds";
import { VanityNameServers } from "./vanity_name_servers";
import { Webhooks } from "./webhooks";
import { Zones } from "./zones";

export type QueryParams = {
  [name: string]: string | boolean | number | null | undefined;
};

export const toQueryString = (params: QueryParams) => {
  let queryString = "";
  for (const [name, value] of Object.entries(params)) {
    if (value == null || value === false) {
      continue;
    }
    queryString += encodeURIComponent(name);
    if (value !== true) {
      queryString += "=" + encodeURIComponent(value.toString());
    }
  }
  return queryString;
};

const versionedPath = (path: string, params: QueryParams) => {
  let versionedPath = `/v2${path}`;
  const queryString = toQueryString(params);
  if (queryString) {
    versionedPath = `${versionedPath}?${queryString}`;
  }
  return versionedPath;
};

export class TimeoutError extends Error {}

export class RequestError extends Error {
  constructor(readonly status: number, description: string) {
    super(description);
  }
}

export class AuthenticationError extends RequestError {
  constructor(readonly data: any) {
    super(401, "Authentication error");
  }
}

export class NotFoundError extends RequestError {
  constructor(readonly data: any) {
    super(404, "Not found");
  }
}

export class MethodNotAllowedError extends RequestError {
  constructor() {
    super(405, "Method not allowed");
  }
}

export class TooManyRequestsError extends RequestError {
  constructor() {
    super(429, "Too many requests");
  }
}

export class ClientError extends RequestError {
  constructor(status: number, readonly data: any) {
    super(status, "Bad request");
  }

  // This is a standard method across all our clients to get the errors from a failed response.
  attributeErrors() {
    return this.data.errors;
  }
}

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

const getFetcherForPlatform = (): Fetcher => {
  // @ts-ignore
  if (typeof window == "object") {
    return async ({ url, timeout, ...req }) => {
      const abortController = new AbortController();
      if (timeout) {
        setTimeout(() => abortController.abort(), timeout);
      }
      try {
        const res = await fetch(url, {
          ...req,
          signal: abortController.signal,
        });
        const status = res.status;
        const body = await res.text();
        return { status, body };
      } catch (err) {
        // Don't just check `err.name == "AbortError"`, as that could be any AbortController and aborted for any reason. Only `abortController` signifies tiemout.
        if (abortController.signal.aborted) {
          throw new TimeoutError();
        }
        throw err;
      }
    };
  }
  const Buffer: typeof import("node:buffer").Buffer = require("node:buffer");
  const https: typeof import("node:https") = require("node:https");
  return ({ url, method, headers, timeout, body }) =>
    new Promise((resolve, reject) => {
      const req = https
        .request(url, {
          method,
          headers,
          timeout,
        })
        .on("response", (res) => {
          const chunks = Array<Buffer>();
          res
            .on("data", (chunk) => chunks.push(chunk))
            .on("end", () =>
              resolve({
                status: res.statusCode!,
                body: Buffer.concat(chunks).join(""),
              })
            )
            .on("error", reject);
        })
        .on("timeout", () => {
          // A Promise can only be fulfilled once, so we don't need to flag this; any further "error" events with `reject` calls will do nothing.
          req.destroy();
          reject(new TimeoutError());
        })
        .on("error", reject)
        .end(body);
    });
};

export class DNSimple {
  static VERSION = pkg.version;
  static DEFAULT_TIMEOUT = 120000;
  static DEFAULT_BASE_URL = "https://api.dnsimple.com";
  static DEFAULT_USER_AGENT = `dnsimple-node/${DNSimple.VERSION}`;

  accessToken: string | undefined;
  baseUrl: string;
  fetcher: Fetcher;
  timeout: number;
  userAgent: string;

  readonly accounts = new Accounts(this);
  readonly certificates = new Certificates(this);
  readonly collaborators = new Collaborators(this);
  readonly contacts = new Contacts(this);
  readonly domains = new Domains(this);
  readonly identity = new Identity(this);
  readonly oauth = new OAuth(this);
  readonly registrar = new Registrar(this);
  readonly services = new Services(this);
  readonly templates = new Templates(this);
  readonly tlds = new Tlds(this);
  readonly vanityNameServers = new VanityNameServers(this);
  readonly webhooks = new Webhooks(this);
  readonly zones = new Zones(this);

  constructor({
    accessToken,
    baseUrl = DNSimple.DEFAULT_BASE_URL,
    fetcher = getFetcherForPlatform(),
    timeout = DNSimple.DEFAULT_TIMEOUT,
    userAgent = DNSimple.DEFAULT_USER_AGENT,
  }: {
    accessToken?: string;
    baseUrl?: string;
    fetcher?: Fetcher;
    timeout?: number;
    userAgent?: string;
  } = {}) {
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
    this.fetcher = fetcher;
    this.timeout = timeout;
    this.userAgent = userAgent;
  }

  async request(method: string, path: string, body: any, params: QueryParams) {
    const timeout = this.timeout;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
    };
    const { status, body: data } = await this.fetcher({
      url: this.baseUrl + versionedPath(path, params),
      method,
      headers,
      timeout,
      body: body == null ? undefined : JSON.stringify(body),
    });
    if (status === 401) {
      throw new AuthenticationError(JSON.parse(data));
    }
    if (status === 404) {
      throw new NotFoundError(JSON.parse(data));
    }
    if (status === 405) {
      throw new MethodNotAllowedError();
    }
    if (status === 429) {
      throw new TooManyRequestsError();
    }
    if (status >= 400 && status < 500) {
      throw new ClientError(status, JSON.parse(data));
    }
    if (status === 204) {
      return {};
    }
    if (status >= 200 && status < 300) {
      return JSON.parse(data);
    }
    // TODO This doesn't seem correct?
    // TODO How are we handling 5xx?
    if (status >= 400) {
      return JSON.parse(data);
    }
    throw new Error(`Unsupported status code: ${status}`);
  }
}
