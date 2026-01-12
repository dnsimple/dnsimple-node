import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Registrar {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Checks a domain name for availability.
   *
   * GET /{account}/registrar/domains/{domain}/check
   *
   * @see https://developer.dnsimple.com/v2/registrar/#checkDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  checkDomain = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainCheckResult }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/check`,
        null,
        params
      );
    return method;
  })();

  /**
   * Retrieve domain prices.
   *
   * GET /{account}/registrar/domains/{domain}/prices
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getDomainPrices
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomainPrices = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainPrices }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/prices`,
        null,
        params
      );
    return method;
  })();

  /**
   * Registers a domain name.
   *
   * Your account must be active for this command to complete successfully. You will be automatically charged the registration fee upon successful registration, so please be careful with this command.
   *
   * POST /{account}/registrar/domains/{domain}/registrations
   *
   * @see https://developer.dnsimple.com/v2/registrar/#registerDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  registerDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{
        registrant_id: number;
        whois_privacy: boolean;
        auto_renew: boolean;
        extended_attributes: {};
        premium_price: string;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainRegistration }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/registrations`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing domain registration.
   *
   * GET /{account}/registrar/domains/{domain}/registrations/{domainregistration}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getDomainRegistration
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param domainregistration The domain registration id
   * @param params Query parameters
   */
  getDomainRegistration = (() => {
    const method = (
      account: number,
      domain: string,
      domainregistration: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainRegistration }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/registrations/${domainregistration}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Transfers a domain name from another registrar.
   *
   * Your account must be active for this command to complete successfully. You will be automatically charged the 1-year transfer fee upon successful transfer, so please be careful with this command. The transfer may take anywhere from a few minutes up to 7 days.
   *
   * POST /{account}/registrar/domains/{domain}/transfers
   *
   * @see https://developer.dnsimple.com/v2/registrar/#transferDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  transferDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{
        registrant_id: number;
        auth_code: string;
        whois_privacy: boolean;
        auto_renew: boolean;
        extended_attributes: {};
        premium_price: string;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransfer }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/transfers`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing domain transfer.
   *
   * GET /{account}/registrar/domains/{domain}/transfers/{domaintransfer}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getDomainTransfer
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param domaintransfer The domain transfer id
   * @param params Query parameters
   */
  getDomainTransfer = (() => {
    const method = (
      account: number,
      domain: string,
      domaintransfer: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransfer }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/transfers/${domaintransfer}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Cancels an in progress domain transfer.
   *
   * DELETE /{account}/registrar/domains/{domain}/transfers/{domaintransfer}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#cancelDomainTransfer
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param domaintransfer The domain transfer id
   * @param params Query parameters
   */
  cancelDomainTransfer = (() => {
    const method = (
      account: number,
      domain: string,
      domaintransfer: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransfer }> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/domains/${domain}/transfers/${domaintransfer}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Explicitly renews a domain, if the registry supports this function.
   *
   * Your account must be active for this command to complete successfully. You will be automatically charged the renewal fee upon successful renewal, so please be careful with this command.
   *
   * POST /{account}/registrar/domains/{domain}/renewals
   *
   * @see https://developer.dnsimple.com/v2/registrar/#domainRenew
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  renewDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{ period: number; premium_price: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainRenewal }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/renewals`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing domain renewal.
   *
   * GET /{account}/registrar/domains/{domain}/renewals/{domainrenewal}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getDomainRenewal
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param domainrenewal The domain renewal id
   * @param params Query parameters
   */
  getDomainRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      domainrenewal: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainRenewal }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/renewals/${domainrenewal}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Prepares a domain for transferring out.
   *
   * This will unlock a domain and send the authorization code to the domain's administrative contact.
   *
   * POST /{account}/registrar/domains/{domain}/authorize_transfer_out
   *
   * @see https://developer.dnsimple.com/v2/registrar/#authorizeDomainTransferOut
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  transferDomainOut = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/authorize_transfer_out`,
        null,
        params
      );
    return method;
  })();

  /**
   * Lists the name servers for the domain.
   *
   * GET /{account}/registrar/domains/{domain}/delegation
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#getDomainDelegation
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomainDelegation = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: Array<string> }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/delegation`,
        null,
        params
      );
    return method;
  })();

  /**
   * Changes the domain name servers.
   *
   * PUT /{account}/registrar/domains/{domain}/delegation
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#changeDomainDelegation
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  changeDomainDelegation = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<Array<string>>,
      params: QueryParams & {} = {}
    ): Promise<{ data: Array<string> }> =>
      this._client.request(
        "PUT",
        `/${account}/registrar/domains/${domain}/delegation`,
        data,
        params
      );
    return method;
  })();

  /**
   * Delegate a domain to vanity name servers.
   *
   * PUT /{account}/registrar/domains/{domain}/delegation/vanity
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#changeDomainDelegationToVanity
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  changeDomainDelegationToVanity = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<Array<string>>,
      params: QueryParams & {} = {}
    ): Promise<{ data: Array<types.NameServer> }> =>
      this._client.request(
        "PUT",
        `/${account}/registrar/domains/${domain}/delegation/vanity`,
        data,
        params
      );
    return method;
  })();

  /**
   * De-delegate a domain from vanity name servers.
   *
   * DELETE /{account}/registrar/domains/{domain}/delegation/vanity
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#changeDomainDelegationFromVanity
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  changeDomainDelegationFromVanity = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/domains/${domain}/delegation/vanity`,
        null,
        params
      );
    return method;
  })();

  /**
   * Enables auto renewal for the domain.
   *
   * PUT /{account}/registrar/domains/{domain}/auto_renewal
   *
   * @see https://developer.dnsimple.com/v2/registrar/#enableDomainAutoRenewal
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableDomainAutoRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "PUT",
        `/${account}/registrar/domains/${domain}/auto_renewal`,
        null,
        params
      );
    return method;
  })();

  /**
   * Disables auto renewal for the domain.
   *
   * DELETE /{account}/registrar/domains/{domain}/auto_renewal
   *
   * @see https://developer.dnsimple.com/v2/registrar/#disableDomainAutoRenewal
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableDomainAutoRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/domains/${domain}/auto_renewal`,
        null,
        params
      );
    return method;
  })();

  /**
   * Gets the whois privacy status for an existing domain.
   *
   * GET /{account}/registrar/domains/{domain}/whois_privacy
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#getWhoisPrivacy
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.WhoisPrivacy }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/whois_privacy`,
        null,
        params
      );
    return method;
  })();

  /**
   * Enables the WHOIS privacy for the domain.
   *
   * Note that if the WHOIS privacy is not purchased for the domain, enabling WHOIS privacy will cause the service to be purchased for a period of 1 year. If WHOIS privacy was previously purchased and disabled, then calling this will enable the WHOIS privacy.
   *
   * PUT /{account}/registrar/domains/{domain}/whois_privacy
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#enableWhoisPrivacy
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.WhoisPrivacy }> =>
      this._client.request(
        "PUT",
        `/${account}/registrar/domains/${domain}/whois_privacy`,
        null,
        params
      );
    return method;
  })();

  /**
   * Disables the WHOIS privacy for the domain.
   *
   * DELETE /{account}/registrar/domains/{domain}/whois_privacy
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#disableWhoisPrivacy
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.WhoisPrivacy }> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/domains/${domain}/whois_privacy`,
        null,
        params
      );
    return method;
  })();

  /**
   * Renews the WHOIS privacy for the domain.
   *
   * Note that if the WHOIS privacy was never purchased for the domain or if there is another renewal order in progress, renewing WHOIS privacy will return an error.
   *
   * POST /{account}/registrar/domains/{domain}/whois_privacy/renewals
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#renewWhoisPrivacy
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  renewWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.WhoisPrivacyRenewal }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/whois_privacy/renewals`,
        null,
        params
      );
    return method;
  })();

  /**
   * List registrant changes in the account.
   *
   * This API is paginated. Call `listRegistrantChanges.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listRegistrantChanges.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/registrar/registrant_changes
   *
   * @see https://developer.dnsimple.com/v2/registrar/#listRegistrantChanges
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   * @param params.state Only include results with a state field exactly matching the given string
   * @param params.domain_id Only include results with a domain_id field exactly matching the given string
   * @param params.contact_id Only include results with a contact_id field exactly matching the given string
   */
  listRegistrantChanges = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc";
        state?: "new" | "pending" | "completed" | "cancelling" | "cancelled";
        domain_id?: string;
        contact_id?: string;
      } = {}
    ): Promise<{
      data: Array<types.RegistrantChange>;
      pagination: types.Pagination;
    }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/registrant_changes`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc";
        state?: "new" | "pending" | "completed" | "cancelling" | "cancelled";
        domain_id?: string;
        contact_id?: string;
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {
        sort?: "id:asc" | "id:desc";
        state?: "new" | "pending" | "completed" | "cancelling" | "cancelled";
        domain_id?: string;
        contact_id?: string;
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
   * Start registrant change.
   *
   * POST /{account}/registrar/registrant_changes
   *
   * @see https://developer.dnsimple.com/v2/registrar/#createRegistrantChange
   *
   * @param account The account id
   * @param params Query parameters
   */
  createRegistrantChange = (() => {
    const method = (
      account: number,
      data: Partial<{
        domain_id: string | number;
        contact_id: string | number;
        extended_attributes: Record<string, string>;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.RegistrantChange }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/registrant_changes`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the requirements of a registrant change.
   *
   * POST /{account}/registrar/registrant_changes/check
   *
   * @see https://developer.dnsimple.com/v2/registrar/#checkRegistrantChange
   *
   * @param account The account id
   * @param params Query parameters
   */
  checkRegistrantChange = (() => {
    const method = (
      account: number,
      data: Partial<{
        domain_id: string | number;
        contact_id: string | number;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.RegistrantChangeCheck }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/registrant_changes/check`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing registrant change.
   *
   * GET /{account}/registrar/registrant_changes/{registrantchange}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getRegistrantChange
   *
   * @param account The account id
   * @param registrantchange The registrant change id
   * @param params Query parameters
   */
  getRegistrantChange = (() => {
    const method = (
      account: number,
      registrantchange: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.RegistrantChange }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/registrant_changes/${registrantchange}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Cancel an ongoing registrant change from the account.
   *
   * DELETE /{account}/registrar/registrant_changes/{registrantchange}
   *
   * @see https://developer.dnsimple.com/v2/registrar/#deleteRegistrantChange
   *
   * @param account The account id
   * @param registrantchange The registrant change id
   * @param params Query parameters
   */
  deleteRegistrantChange = (() => {
    const method = (
      account: number,
      registrantchange: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/registrant_changes/${registrantchange}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Gets the transfer lock status for a domain.
   *
   * GET /{account}/registrar/domains/{domain}/transfer_lock
   *
   * @see https://developer.dnsimple.com/v2/registrar/#getDomainTransferLock
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomainTransferLock = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransferLock }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/transfer_lock`,
        null,
        params
      );
    return method;
  })();

  /**
   * Locks the domain to prevent unauthorized transfers.
   *
   * POST /{account}/registrar/domains/{domain}/transfer_lock
   *
   * @see https://developer.dnsimple.com/v2/registrar/#enableDomainTransferLock
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableDomainTransferLock = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransferLock }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/transfer_lock`,
        null,
        params
      );
    return method;
  })();

  /**
   * Unlocks the domain to allow domain transfers.
   *
   * DELETE /{account}/registrar/domains/{domain}/transfer_lock
   *
   * @see https://developer.dnsimple.com/v2/registrar/#disableDomainTransferLock
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableDomainTransferLock = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.DomainTransferLock }> =>
      this._client.request(
        "DELETE",
        `/${account}/registrar/domains/${domain}/transfer_lock`,
        null,
        params
      );
    return method;
  })();
}
