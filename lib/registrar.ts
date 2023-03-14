import type { DNSimple, QueryParams } from "./main";

export class Registrar {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Checks a domain name for availability.
   *
   * GET /{account}/registrar/domains/{domain}/check
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
    ): Promise<{
      data: { domain: string; available: boolean; premium: boolean };
    }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/check`,
        null,
        params
      );
    return method;
  })();

  /**
   * Deprecated in favor of getDomainPrices.
   *
   * Retrieves the premium price for a premium domain.
   *
   * Please note that a premium price can be different for registration, renewal, transfer. By default this endpoint returns the premium price for registration. If you need to check a different price, you should specify it with the action param.
   *
   * GET /{account}/registrar/domains/{domain}/premium_price
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.action Optional action between "registration", "renewal", and "transfer". If omitted, it defaults to "registration".
   */
  getDomainPremiumPrice = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & { action?: string } = {}
    ): Promise<{ data: { premium_price: string; action: string } }> =>
      this._client.request(
        "GET",
        `/${account}/registrar/domains/${domain}/premium_price`,
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getDomainPrices = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        domain: string;
        premium: boolean;
        registration_price: number;
        renewal_price: number;
        transfer_price: number;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  registerDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: {
        registrant_id?: number;
        whois_privacy?: boolean;
        auto_renew?: boolean;
        extended_attributes?: {};
        premium_price?: string;
      },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        registrant_id: number;
        period: number;
        state: string;
        auto_renew: boolean;
        whois_privacy: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        registrant_id: number;
        period: number;
        state: string;
        auto_renew: boolean;
        whois_privacy: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  transferDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: {
        registrant_id?: number;
        auth_code?: string;
        whois_privacy?: boolean;
        auto_renew?: boolean;
        extended_attributes?: {};
        premium_price?: string;
      },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        registrant_id: number;
        state: string;
        auto_renew: boolean;
        whois_privacy: boolean;
        status_description: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        registrant_id: number;
        state: string;
        auto_renew: boolean;
        whois_privacy: boolean;
        status_description: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        registrant_id: number;
        state: string;
        auto_renew: boolean;
        whois_privacy: boolean;
        status_description: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  renewDomain = (() => {
    const method = (
      account: number,
      domain: string,
      data: { period?: number; premium_price?: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        period: number;
        state: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        period: number;
        state: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  changeDomainDelegation = (() => {
    const method = (
      account: number,
      domain: string,
      data: Array<string>,
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  changeDomainDelegationToVanity = (() => {
    const method = (
      account: number,
      domain: string,
      data: Array<string>,
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  getWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        enabled: boolean;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  enableWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        enabled: boolean;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  disableWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        enabled: boolean;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  renewWhoisPrivacy = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        whois_privacy_id: number;
        state: string;
        enabled: boolean;
        expires_on: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/registrar/domains/${domain}/whois_privacy/renewals`,
        null,
        params
      );
    return method;
  })();
}
