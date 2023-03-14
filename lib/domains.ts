import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Domains {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the domains in the account.
   *
   * This API is paginated. Call `listDomains.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDomains.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains
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
        sort?: string;
      } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        expires_on: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/domains`, null, params);
    method.iterateAll = (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?: string;
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {
        name_like?: string;
        registrant_id?: number;
        sort?: string;
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
   * @param account The account id
   * @param params Query parameters
   */
  createDomain = (() => {
    const method = (
      account: number,
      data: { name?: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> => this._client.request("POST", `/${account}/domains`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of an existing domain.
   *
   * GET /{account}/domains/{domain}
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
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        registrant_id: number | null;
        name: string;
        unicode_name: string;
        state: string;
        auto_renew: boolean;
        private_whois: boolean;
        expires_at: string | null;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * Lists collaborators for the domain.
   *
   * This API is paginated. Call `listCollaborators.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listCollaborators.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/collaborators
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  listCollaborators = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        domain_name: string;
        user_id: number;
        user_email: string;
        invitation: boolean;
        created_at: string;
        updated_at: string;
        accepted_at: string;
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
        `/${account}/domains/${domain}/collaborators`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
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
   * Adds a collaborator to the domain.
   *
   * At the time of the add, a collaborator may or may not have a DNSimple account. In case the collaborator doesn't have a DNSimple account, the system will invite them to register to DNSimple first and then to accept the collaboration invitation. In the other case, they are automatically added to the domain as collaborator. They can decide to reject the invitation later.
   *
   * POST /{account}/domains/{domain}/collaborators
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  addCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      data: { email?: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        domain_name: string;
        user_id: number;
        user_email: string;
        invitation: boolean;
        created_at: string;
        updated_at: string;
        accepted_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/collaborators`,
        data,
        params
      );
    return method;
  })();

  /**
   * Removes a collaborator from the domain.
   *
   * DELETE /{account}/domains/{domain}/collaborators/{collaborator}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param collaborator The collaborator id
   * @param params Query parameters
   */
  removeCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      collaborator: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/collaborators/${collaborator}`,
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: { enabled: boolean; created_at: string; updated_at: string };
    }> =>
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
  enableDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: { enabled: boolean; created_at: string; updated_at: string };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listDelegationSignerRecords = (() => {
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
  createDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      data: { digest?: string },
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
  getDelegationSignerRecord = (() => {
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
      data: { alias_name?: string; destination_email?: string },
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
  initiatePush = (() => {
    const method = (
      account: number,
      domain: string,
      data: { new_account_email?: string },
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
      data: { contact_id?: number },
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
