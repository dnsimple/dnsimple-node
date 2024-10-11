import * as pkg from "../package.json";
import { Accounts } from "./accounts";
import { Billing } from "./billing";
import { Certificates } from "./certificates";
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
import { type Fetcher, getRuntimeFetcher } from "./fetcher/fetcher";

export * from "./types";

export type QueryParams = {
  [name: string]: string | boolean | number | null | undefined;
};

export const toQueryString = (params: QueryParams) => {
  const queryParams = [];
  for (const [name, value] of Object.entries(params)) {
    if (value == null || value === false) {
      continue;
    }
    let queryString = encodeURIComponent(name);
    if (value !== true) {
      queryString += "=" + encodeURIComponent(value.toString());
    }
    queryParams.push(queryString);
  }
  return queryParams.join("&");
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
  constructor(
    readonly status: number,
    description: string
  ) {
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
  constructor(
    status: number,
    readonly data: any
  ) {
    super(status, "Bad request");
  }

  // This is a standard method across all our clients to get the errors from a failed response.
  attributeErrors() {
    return this.data.errors;
  }
}

export class ServerError extends RequestError {
  constructor(
    status: number,
    readonly data: any
  ) {
    super(status, "Server error");
  }
}

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
  readonly billing = new Billing(this);
  readonly certificates = new Certificates(this);
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
    fetcher = getRuntimeFetcher(),
    timeout = DNSimple.DEFAULT_TIMEOUT,
    userAgent = "",
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
      "User-Agent": `${this.userAgent} ${DNSimple.DEFAULT_USER_AGENT}`.trim(),
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
      return !data ? {} : JSON.parse(data);
    }
    if (status >= 500) {
      throw new ServerError(status, JSON.parse(data));
    }
    throw new Error(`Unsupported status code: ${status}`);
  }
}
