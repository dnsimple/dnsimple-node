import type { ParsedUrlQueryInput } from "querystring";

export type RequestOptions = {
  query?: {[name: string]: string};
  filter?: {[name: string]: string};
} & ParsedUrlQueryInput;
