import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Certificates {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the certificates for a domain.
   *
   * This API is paginated. Call `listCertificates.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listCertificates.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/certificates
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id.
   */
  listCertificates = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        contact_id: number;
        name: string;
        common_name: string;
        years: number;
        csr: string;
        state: string;
        auto_renew: boolean;
        alternate_names: Array<string>;
        authority_identifier: string;
        created_at: string;
        updated_at: string;
        expires_at: string;
        expires_on: string;
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
        `/${account}/domains/${domain}/certificates`,
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
   * Retrieves the details of an existing certificate.
   *
   * GET /{account}/domains/{domain}/certificates/{certificate}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param params Query parameters
   */
  getCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        contact_id: number;
        name: string;
        common_name: string;
        years: number;
        csr: string;
        state: string;
        auto_renew: boolean;
        alternate_names: Array<string>;
        authority_identifier: string;
        created_at: string;
        updated_at: string;
        expires_at: string;
        expires_on: string;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Gets the PEM-encoded certificate, along with the root certificate and intermediate chain.
   *
   * GET /{account}/domains/{domain}/certificates/{certificate}/download
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param params Query parameters
   */
  downloadCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: { server: string; root: string | null; chain: Array<string> };
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}/download`,
        null,
        params
      );
    return method;
  })();

  /**
   * Gets the PEM-encoded certificate private key.
   *
   * GET /{account}/domains/{domain}/certificates/{certificate}/private_key
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param params Query parameters
   */
  getCertificatePrivateKey = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: { private_key: string } }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}/private_key`,
        null,
        params
      );
    return method;
  })();

  /**
   * Orders a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/letsencrypt
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  purchaseLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      data: {
        auto_renew?: boolean;
        name?: string;
        alternate_names?: Array<string>;
        signature_algorithm?: string;
      },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        certificate_id: number;
        state: string;
        auto_renew: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/letsencrypt`,
        data,
        params
      );
    return method;
  })();

  /**
   * Issues a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/letsencrypt/{purchaseId}/issue
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param purchaseId The certificate purchase order id received by `purchaseLetsencryptCertificate`.
   * @param params Query parameters
   */
  issueLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      purchaseId: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        contact_id: number;
        name: string;
        common_name: string;
        years: number;
        csr: string;
        state: string;
        auto_renew: boolean;
        alternate_names: Array<string>;
        authority_identifier: string;
        created_at: string;
        updated_at: string;
        expires_at: string;
        expires_on: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/letsencrypt/${purchaseId}/issue`,
        null,
        params
      );
    return method;
  })();

  /**
   * Renews a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/letsencrypt/{certificate}/renewals
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param params Query parameters
   */
  purchaseLetsencryptCertificateRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      data: { auto_renew?: boolean; signature_algorithm?: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        old_certificate_id: number;
        new_certificate_id: number;
        state: string;
        auto_renew: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/letsencrypt/${certificate}/renewals`,
        data,
        params
      );
    return method;
  })();

  /**
   * Issues a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate renewal ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/letsencrypt/{certificate}/renewals/{renewalId}/issue
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param renewalId The certificate renewal order id received by {@link Certificates.purchaseRenewalLetsencryptCertificate}.
   * @param params Query parameters
   */
  issueLetsencryptCertificateRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      renewalId: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        domain_id: number;
        contact_id: number;
        name: string;
        common_name: string;
        years: number;
        csr: string;
        state: string;
        auto_renew: boolean;
        alternate_names: Array<string>;
        authority_identifier: string;
        created_at: string;
        updated_at: string;
        expires_at: string;
        expires_on: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/letsencrypt/${certificate}/renewals/${renewalId}/issue`,
        null,
        params
      );
    return method;
  })();
}
