import type Client from "./client";
import type { RequestOptions } from "./request";
import paginate from "./paginate";

export default class Certificates {
  constructor(private readonly _client: Client) {}

  /**
   * Lists the certificates for a domain.
   *
   * This API is paginated. Call `listCertificates.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains/{domain}/certificates
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id.
   */
  listCertificates = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & { sort?: string } = {}
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
        options
      );
    method.paginate = (
      account: number,
      domain: string,
      options: RequestOptions & { sort?: string } = {}
    ) =>
      paginate((page) => method(account, domain, { ...options, page } as any));
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
   * @param options Query parameters
   */
  getCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      options: RequestOptions & {} = {}
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
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}`,
        null,
        options
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
   * @param options Query parameters
   */
  downloadCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: { server: string; root: string | null; chain: Array<string> };
    }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}/download`,
        null,
        options
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
   * @param options Query parameters
   */
  getCertificatePrivateKey = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      options: RequestOptions & {} = {}
    ): Promise<{ data: { private_key: string } }> =>
      this._client.request(
        "GET",
        `/${account}/domains/${domain}/certificates/${certificate}/private_key`,
        null,
        options
      );
    return method;
  })();

  /**
   * Orders a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/certificates/letsencrypt
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  purchaseLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      data: {
        auto_renew: boolean;
        name: string;
        alternate_names: Array<string>;
        signature_algorithm: string;
      },
      options: RequestOptions & {} = {}
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
        `/${account}/domains/${domain}/certificates/certificates/letsencrypt`,
        data,
        options
      );
    return method;
  })();

  /**
   * Issues a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/certificates/letsencrypt/{purchaseId}/issue
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param purchaseId The certificate purchase order id received by `purchaseLetsencryptCertificate`.
   * @param options Query parameters
   */
  issueLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      purchaseId: number,
      options: RequestOptions & {} = {}
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
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/certificates/letsencrypt/${purchaseId}/issue`,
        null,
        options
      );
    return method;
  })();

  /**
   * Renews a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/certificates/letsencrypt/{certificate}/renewals
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param options Query parameters
   */
  purchaseRenewalLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      data: { auto_renew: boolean; signature_algorithm: string },
      options: RequestOptions & {} = {}
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
        `/${account}/domains/${domain}/certificates/certificates/letsencrypt/${certificate}/renewals`,
        data,
        options
      );
    return method;
  })();

  /**
   * Issues a [Let's Encrypt](https://dnsimple.com/letsencrypt) certificate renewal ordered with DNSimple.
   *
   * POST /{account}/domains/{domain}/certificates/certificates/letsencrypt/{certificate}/renewals/{renewalId}/issue
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param certificate The certificate id
   * @param renewalId The certificate renewal order id received by `purchaseRenewalLetsencryptCertificate`.
   * @param options Query parameters
   */
  issueRenewalLetsencryptCertificate = (() => {
    const method = (
      account: number,
      domain: string,
      certificate: number,
      renewalId: number,
      options: RequestOptions & {} = {}
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
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/certificates/certificates/letsencrypt/${certificate}/renewals/${renewalId}/issue`,
        null,
        options
      );
    return method;
  })();
}
