import type { DNSimple, QueryParams } from "./main";
import type * as types from "./types";

export class DnsAnalytics {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Queries and returns DNS Analytics data for the given query parameters.
   *
   * This API is in Public Beta.
   *
   * GET /{account}/dns_analytics
   *
   * @see https://developer.dnsimple.com/v2/dns-analytics/#queryDnsAnalytics
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.start_date Only include results after the given date.
   * @param params.end_date Only include results before the given date.
   * @param params.groupings Group results by the given fields.
   * @param params.sort Sort results. Default sorting is by date ascending, then by zone name ascending.
   */
  queryDnsAnalytics = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        start_date?: string;
        end_date?: string;
        groupings?: string;
        sort?: string;
      } = {}
    ): Promise<{
      data: types.DnsAnalytics;
      query: types.DnsAnalyticsQuery;
      pagination: types.Pagination;
    }> =>
      this._client.request("GET", `/${account}/dns_analytics`, null, params);
    return method;
  })();
}
