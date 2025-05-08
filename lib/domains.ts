import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Domains {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the domains in the account.
   *
   * This API is paginated. Call `listDomains.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDomains.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains
   *
   * @see https://developer.dnsimple.com/v2/domains/#listDomains
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.name_like Only include results with a name field containing the given string
   * @param params.registrant_id Only include results with the registrant_id field matching the given value
   * @param params.sort Sort results. Default sorting is ascending by name.
   */
  listDomains = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "expiration:asc"
          | "expiration:desc";
      } = {}
    ): Promise<{ data: Array<types.Domain>; pagination: types.Pagination }> =>
      this._client.request("GET", `/${account}/domains`, null, params);
    method.iterateAll = (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "expiration:asc"
          | "expiration:desc";
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "expiration:asc"
          | "expiration:desc";
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

  /**
   * Creates a domain and the corresponding zone into the account.
   *
   * POST /{account}/domains
   *
   * @see https://developer.dnsimple.com/v2/domains/#createDomain
   *
   * @param account The account id
   * @param params Query parameters
   */
  createDomain = (() => {
    const method = (
      account: number,
      data: Partial<{ name: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Domain }> =>
      this._client.request("POST", `/${account}/domains`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of an existing domain.
   *
   * GET /{account}/domains/{domain}
   *
   * @see https://developer.dnsimple.com/v2/domains/#getDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomain = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Domain }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes a domain from the account.
   *
   * DELETE /{account}/domains/{domain}
   *
   * @see https://developer.dnsimple.com/v2/domains/#deleteDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  deleteDomain = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Gets the DNSSEC status for an existing domain.
   *
   * GET /{account}/domains/{domain}/dnssec
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#getDomainDnssec
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DNSSEC }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/dnssec`,
        null,
        params
      );
    return method;
  })();

  /**
   * Enables DNSSEC for the domain.
   *
   * It will enable signing of the zone. If the domain is registered with DNSimple, it will also add the DS record to the corresponding registry.
   *
   * POST /{account}/domains/{domain}/dnssec
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#enableDomainDnssec
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DNSSEC }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/dnssec`,
        null,
        params
      );
    return method;
  })();

  /**
   * Disables DNSSEC for the domain.
   *
   * It will disable signing of the zone. If the domain is registered with DNSimple, it will also remove the DS record at the registry corresponding to the disabled DNSSEC signing.
   *
   * DELETE /{account}/domains/{domain}/dnssec
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#disableDomainDnssec
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/dnssec`,
        null,
        params
      );
    return method;
  })();

  /**
   * Lists the DS records for the domain.
   *
   * This API is paginated. Call `listDelegationSignerRecords.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDelegationSignerRecords.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/ds_records
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#listDomainDelegationSignerRecords
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listDelegationSignerRecords = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "created_at:asc" | "created_at:desc";
      } = {}
    ): Promise<{
      data: Array<types.DelegationSigner>;
      pagination: types.Pagination;
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/ds_records`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "created_at:asc" | "created_at:desc";
      } = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc" | "created_at:asc" | "created_at:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, domain, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Adds a DS record to the domain.
   *
   * POST /{account}/domains/{domain}/ds_records
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#createDomainDelegationSignerRecord
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  createDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{
        algorithm: string;
        digest: string;
        digest_type: string;
        keytag: string;
        public_key: string;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DelegationSigner }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/ds_records`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing DS record.
   *
   * GET /{account}/domains/{domain}/ds_records/{ds}
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#getDomainDelegationSignerRecord
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param ds The delegation signer record id
   * @param params Query parameters
   */
  getDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      ds: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DelegationSigner }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/ds_records/${ds}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Removes a DS record from the domain.
   *
   * DELETE /{account}/domains/{domain}/ds_records/{ds}
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#deleteDomainDelegationSignerRecord
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param ds The delegation signer record id
   * @param params Query parameters
   */
  deleteDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      ds: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/ds_records/${ds}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Lists email forwards for the domain.
   *
   * This API is paginated. Call `listEmailForwards.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listEmailForwards.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/email_forwards
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#listEmailForwards
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listEmailForwards = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "from:asc"
          | "from:desc"
          | "to:asc"
          | "to:desc";
      } = {}
    ): Promise<{
      data: Array<types.EmailForward>;
      pagination: types.Pagination;
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/email_forwards`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "from:asc"
          | "from:desc"
          | "to:asc"
          | "to:desc";
      } = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "from:asc"
          | "from:desc"
          | "to:asc"
          | "to:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, domain, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Creates a new email forward for the domain.
   *
   * POST /{account}/domains/{domain}/email_forwards
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#createEmailForward
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  createEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{ alias_name: string; destination_email: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.EmailForward }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/email_forwards`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing email forward.
   *
   * GET /{account}/domains/{domain}/email_forwards/{emailforward}
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#getEmailForward
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param emailforward The email forward id
   * @param params Query parameters
   */
  getEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      emailforward: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.EmailForward }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/email_forwards/${emailforward}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes an email forward.
   *
   * DELETE /{account}/domains/{domain}/email_forwards/{emailforward}
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#deleteEmailForward
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param emailforward The email forward id
   * @param params Query parameters
   */
  deleteEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      emailforward: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/email_forwards/${emailforward}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Initiates a pust of a domain to another DNSimple account.
   *
   * POST /{account}/domains/{domain}/pushes
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#initiateDomainPush
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  initiatePush = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{ new_account_email: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Push }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/pushes`,
        data,
        params
      );
    return method;
  })();

  /**
   * List pending pushes for the target account.
   *
   * This API is paginated. Call `listPushes.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listPushes.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/pushes
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#listPushes
   *
   * @param account The account id
   * @param params Query parameters
   */
  listPushes = (() => {
    const method = (
      account: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: Array<types.Push>; pagination: types.Pagination }> =>
      this._client.request("GET", `/${account}/pushes`, null, params);
    method.iterateAll = (account: number, params: QueryParams & {} = {}) =>
      paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {} = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Accepts a push to the target account.
   *
   * POST /{account}/pushes/{push}
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#acceptPush
   *
   * @param account The account id
   * @param push The push id
   * @param params Query parameters
   */
  acceptPush = (() => {
    const method = (
      account: number,
      push: number,
      data: Partial<{ contact_id: number }>,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request("POST", `/${account}/pushes/${push}`, data, params);
    return method;
  })();

  /**
   * Rejects a push to the target account.
   *
   * DELETE /{account}/pushes/{push}
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#rejectPush
   *
   * @param account The account id
   * @param push The push id
   * @param params Query parameters
   */
  rejectPush = (() => {
    const method = (
      account: number,
      push: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/pushes/${push}`,
        null,
        params
      );
    return method;
  })();
}
