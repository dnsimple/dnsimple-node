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
   * @param params.start_date Only include results on or after this date (YYYY-MM-DD)
   * @param params.end_date Only include results on or before this date (YYYY-MM-DD)
   * @param params.groupings Group results by the given comma separated fields: date, zone_name
   * @param params.sort Sort results by the given comma separated fields and directions, for example "volume:desc,zone_name:asc"
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
