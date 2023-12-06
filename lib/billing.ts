import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Billing {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the billing charges for the account.
   *
   * This API is paginated. Call `listCharges.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listCharges.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/billing/charges
   *
   * @see https://developer.dnsimple.com/v2/billing/#listCharges
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.start_date Only include results after the given date.
   * @param params.end_date Only include results before the given date.
   * @param params.sort Sort results. Default sorting is by invoiced ascending.
   */
  listCharges = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        start_date?: string;
        end_date?: string;
        sort?: "invoiced:asc" | "invoiced:desc";
      } = {}
    ): Promise<{ data: Array<types.Charge>; pagination: types.Pagination }> =>
      this._client.request("GET", `/${account}/billing/charges`, null, params);
    method.iterateAll = (
      account: number,
      params: QueryParams & {
        start_date?: string;
        end_date?: string;
        sort?: "invoiced:asc" | "invoiced:desc";
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {
        start_date?: string;
        end_date?: string;
        sort?: "invoiced:asc" | "invoiced:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();
}
