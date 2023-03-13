import type Client = require("./client");
import type { RequestOptions } from "./request";
import paginate = require("./paginate");
class Domain {
  constructor(private readonly _client: Client) {}

  /**
   * Gets the DNSSEC status for an existing domain.
   *
   * GET /{account}/domains/{domain}/dnssec
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  getDomainDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ): Promise<{ enabled: boolean; created_at: string; updated_at: string }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/dnssec`,
        null,
        options
      );
    return method;
  })();

  /**
     * Enables DNSSEC for the domain.
It will enable signing of the zone. If the domain is registered with DNSimple, it will also add the DS record to the corresponding registry.
     *
     * POST /{account}/domains/{domain}/dnssec
     *
     * @param account The account id
* @param domain The domain name or id
     * @param options Query parameters
     */
  enableDomainDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ): Promise<{ enabled: boolean; created_at: string; updated_at: string }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/dnssec`,
        null,
        options
      );
    return method;
  })();

  /**
     * Disables DNSSEC for the domain.
It will disable signing of the zone. If the domain is registered with DNSimple, it will also remove the DS record at the registry corresponding to the disabled DNSSEC signing.
     *
     * DELETE /{account}/domains/{domain}/dnssec
     *
     * @param account The account id
* @param domain The domain name or id
     * @param options Query parameters
     */
  disableDomainDnssec = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/dnssec`,
        null,
        options
      );
    return method;
  })();

  /**
   * Lists the DS records for the domain.
   *
   *
   * This API is paginated. Call `listDomainDelegationSignerRecords.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains/{domain}/ds_records
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id.
   */
  listDomainDelegationSignerRecords = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {
        sort?: string;
      } = {}
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
        options
      );
    method.paginate = (
      account: number,
      domain: string,
      options: RequestOptions & {
        sort?: string;
      } = {}
    ) =>
      paginate((page) => method(account, domain, { ...options, page } as any));
    return method;
  })();

  /**
   * Adds a DS record to the domain.
   *
   * POST /{account}/domains/{domain}/ds_records
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  createDomainDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      data: { digest: string },
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  getDomainDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      ds: number,
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  deleteDomainDelegationSignerRecord = (() => {
    const method = (
      account: number,
      domain: string,
      ds: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/ds_records/${ds}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Lists email forwards for the domain.
   *
   *
   * This API is paginated. Call `listEmailForwards.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains/{domain}/email_forwards
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id.
   */
  listEmailForwards = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {
        sort?: string;
      } = {}
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
        options
      );
    method.paginate = (
      account: number,
      domain: string,
      options: RequestOptions & {
        sort?: string;
      } = {}
    ) =>
      paginate((page) => method(account, domain, { ...options, page } as any));
    return method;
  })();

  /**
   * Creates a new email forward for the domain.
   *
   * POST /{account}/domains/{domain}/email_forwards
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  createEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      data: { alias_name: string; destination_email: string },
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  getEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      emailforward: number,
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  deleteEmailForward = (() => {
    const method = (
      account: number,
      domain: string,
      emailforward: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/email_forwards/${emailforward}`,
        null,
        options
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
   * @param options Query parameters
   */
  initiateDomainPush = (() => {
    const method = (
      account: number,
      domain: string,
      data: { new_account_email: string },
      options: RequestOptions & {} = {}
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
        options
      );
    return method;
  })();

  /**
   * List pending pushes for the target account.
   *
   *
   * This API is paginated. Call `listPushes.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/pushes
   *
   * @param account The account id
   * @param options Query parameters
   */
  listPushes = (() => {
    const method = (
      account: number,
      options: RequestOptions & {} = {}
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
    }> => this._client.request("GET", `/${account}/pushes`, null, options);
    method.paginate = (account: number, options: RequestOptions & {} = {}) =>
      paginate((page) => method(account, { ...options, page } as any));
    return method;
  })();

  /**
   * Accepts a push to the target account.
   *
   * POST /{account}/pushes/{push}
   *
   * @param account The account id
   * @param push The push id
   * @param options Query parameters
   */
  acceptPush = (() => {
    const method = (
      account: number,
      push: number,
      data: { contact_id: number },
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request("POST", `/${account}/pushes/${push}`, data, options);
    return method;
  })();

  /**
   * Rejects a push to the target account.
   *
   * DELETE /{account}/pushes/{push}
   *
   * @param account The account id
   * @param push The push id
   * @param options Query parameters
   */
  rejectPush = (() => {
    const method = (
      account: number,
      push: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/pushes/${push}`,
        null,
        options
      );
    return method;
  })();
}
export = Domain;
