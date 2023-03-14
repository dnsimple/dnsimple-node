import type { DNSimple, QueryParams } from "./main";

export class VanityNameServers {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Enables Vanity Name Servers for the domain.
   *
   * This method sets up the appropriate A and AAAA records for the domain to provide vanity name servers, but it does not change the delegation for the domain. To change the delegation for domains to vanity name servers use the endpoints to Delegate to Vanity Name Servers or Dedelegate from Vanity Name Servers.
   *
   * PUT /{account}/vanity/{domain}
   *
   * @see https://developer.dnsimple.com/v2/vanity/#enableVanityNameServers
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableVanityNameServers = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        name: string;
        ipv4: string;
        ipv6: string;
        created_at: string;
        updated_at: string;
      }>;
    }> =>
      this._client.request("PUT", `/${account}/vanity/${domain}`, null, params);
    return method;
  })();

  /**
   * Disables Vanity Name Servers for the domain.
   *
   * This method removes the A and AAAA records required for the domain to provide vanity name servers, but it does not change the delegation for the domain. To change the delegation for domains to vanity name servers use the endpoints to Delegate to Vanity Name Servers or Dedelegate from Vanity Name Servers.
   *
   * DELETE /{account}/vanity/{domain}
   *
   * @see https://developer.dnsimple.com/v2/vanity/#disableVanityNameServers
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableVanityNameServers = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/vanity/${domain}`,
        null,
        params
      );
    return method;
  })();
}
