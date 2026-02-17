import type { DNSimple, QueryParams } from "./main";
import type * as types from "./types";

export class DomainsResearch {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Research a domain name for availability and registration status information.
   *
   * This endpoint provides information about a domain's availability status, including whether it's available for registration, already registered, or has other restrictions that prevent registration.
   *
   * Note: This endpoint is part of a Private Beta. During the beta period, changes to the endpoint may occur at any time. If interested in using this endpoint, reach out to support@dnsimple.com.
   *
   * GET /{account}/domains/research/status
   *
   * @see https://developer.dnsimple.com/v2/domains/research/#getDomainsResearchStatus
   *
   * @param account The account id
   * @param domain The domain name to research
   * @param params Query parameters
   */
  domainResearchStatus = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainResearchStatus }> =>
      this._client.request(
        "GET",
        `/${account}/domains/research/status`,
        null,
        { ...params, domain }
      );
    return method;
  })();
}
