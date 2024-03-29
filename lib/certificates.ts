import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Certificates {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the certificates for a domain.
   *
   * This API is paginated. Call `listCertificates.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listCertificates.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/certificates
   *
   * @see https://developer.dnsimple.com/v2/certificates/#listCertificates
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
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "common_name:asc"
          | "common_name:desc"
          | "expiration:asc"
          | "expiration:desc";
      } = {}
    ): Promise<{
      data: Array<types.Certificate>;
      pagination: types.Pagination;
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
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "common_name:asc"
          | "common_name:desc"
          | "expiration:asc"
          | "expiration:desc";
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
          | "common_name:asc"
          | "common_name:desc"
          | "expiration:asc"
          | "expiration:desc";
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
   * Retrieves the details of an existing certificate.
   *
   * GET /{account}/domains/{domain}/certificates/{certificate}
   *
   * @see https://developer.dnsimple.com/v2/certificates/#getCertificate
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
    ): Promise<{ data: types.Certificate }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#downloadCertificate
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
    ): Promise<{ data: types.CertificateDownload }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#getCertificatePrivateKey
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
    ): Promise<{ data: types.CertificatePrivateKey }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#purchaseLetsencryptCertificate
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  purchaseLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      data: Partial<{
        auto_renew?: boolean;
        name?: string;
        alternate_names?: Array<string>;
        signature_algorithm?: string;
      }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.LetsencryptCertificatePurchase }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#issueLetsencryptCertificate
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
    ): Promise<{ data: types.Certificate }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#purchaseRenewalLetsencryptCertificate
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
      data: Partial<{ auto_renew?: boolean; signature_algorithm?: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.LetsencryptCertificateRenewal }> =>
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
   * @see https://developer.dnsimple.com/v2/certificates/#issueRenewalLetsencryptCertificate
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param renewalId The certificate renewal order id received by `purchaseRenewalLetsencryptCertificate`.
   * @param params Query parameters
   */
  issueLetsencryptCertificateRenewal = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      renewalId: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Certificate }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/letsencrypt/${certificate}/renewals/${renewalId}/issue`,
        null,
        params
      );
    return method;
  })();
}
