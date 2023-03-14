import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Domain {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Gets the DNSSEC status for an existing domain.
   *
   * GET /{account}/domains/{domain}/dnssec
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomainDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ enabled: boolean; created_at: string; updated_at: string }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableDomainDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ enabled: boolean; created_at: string; updated_at: string }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableDomainDnssec = (() => {
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
   * This API is paginated. Call `listDomainDelegationSignerRecords.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDomainDelegationSignerRecords.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/ds_records
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listDomainDelegationSignerRecords = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        algorithm: string;
        digest: string;
        digest_type: string;
        keytag: string;
        public_key: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
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
      params: QueryParams & { sort?: string } = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & { sort?: string } = {}
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  createDomainDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      data: { digest: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        algorithm: string;
        digest: string;
        digest_type: string;
        keytag: string;
        public_key: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param ds The delegation signer record id
   * @param params Query parameters
   */
  getDomainDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      ds: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        algorithm: string;
        digest: string;
        digest_type: string;
        keytag: string;
        public_key: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param ds The delegation signer record id
   * @param params Query parameters
   */
  deleteDomainDelegationSignerRecord = (() => {
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listEmailForwards = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        alias_email: string;
        destination_email: string;
        from: string;
        to: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
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
      params: QueryParams & { sort?: string } = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & { sort?: string } = {}
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  createEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      data: { alias_name: string; destination_email: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        alias_email: string;
        destination_email: string;
        from: string;
        to: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        alias_email: string;
        destination_email: string;
        from: string;
        to: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  initiateDomainPush = (() => {
    const method = (
      account: number,
      domain: string,
      data: { new_account_email: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        contact_id: number;
        account_id: number;
        created_at: string;
        updated_at: string;
        accepted_at: string | null;
      };
    }> =>
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
   * @param account The account id
   * @param params Query parameters
   */
  listPushes = (() => {
    const method = (
      account: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        contact_id: number;
        account_id: number;
        created_at: string;
        updated_at: string;
        accepted_at: string | null;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/pushes`, null, params);
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
   * @param account The account id
   * @param push The push id
   * @param params Query parameters
   */
  acceptPush = (() => {
    const method = (
      account: number,
      push: number,
      data: { contact_id: number },
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
