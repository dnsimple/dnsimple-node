'use strict';

const Paginate = require('./paginate');

/**
 * Provides access to the DNSimple Certificates API.
 *
 * @see https://developer.dnsimple.com/v2/domains/certificates
 */
class Certificates {
  constructor(client) {
    this._client = client;
  }

  /**
   * List certificates for a domain in the account.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#listCertificates
   *
   * @example List certificates in the first page
   * client.certificates.listCertificates(1010, 'example.com').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List certificates, provide a specific page
   * client.certificates.listCertificates(1010, 'example.com', {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List certificates, provide a sorting policy
   * client.certificates.listCertificates(1010, 'example.com', {sort: 'email:asc'}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listCertificates(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates`, options);
  }

  /**
   * List ALL the certificates for a domain in the account.
   *
   * This method is similar to {#listCertificates}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all certificates
   * client.certificates.allCertificates(1010).then(function(certificates) {
   *   // use certificates list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List certificates, provide a sorting policy
   * client.certificates.allCertificates(1010, {sort: 'name:asc'}).then(function(certificates) {
   *   // use certificates list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allCertificates(accountId, domainId, options = {}) {
    return new Paginate(this).paginate(this.listCertificates, [accountId, domainId, options]);
  }

  /**
   * Get the details of a certificate.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#getCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getCertificate(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}`, options);
  }

  /**
   * Get the PEM-encoded certificate, along with the root certificate and intermediate chain.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#downloadCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate ID
   * @param {Object} [options]
   * @return {Promise}
   */
  downloadCertificate(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}/download`, options);
  }

  /**
   * Get the PEM-encoded certificate private key.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#getCertificatePrivateKey
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getCertificatePrivateKey(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}/private_key`, options);
  }

  /**
   * Purchase a Let's Encrypt certificate.
   *
   * This method creates a new purchase order. The order ID should be used to
   + request the issuance of the certificate using `#issueLetsencryptCertificate`.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#purchaseLetsencryptCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {Object} attributes The attributes for the certificate.
   * @param {Object} [options]
   * @return {Promise}
   */
  purchaseLetsencryptCertificate(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/certificates/letsencrypt`, attributes, options);
  }

  /**
   * Issue a pending Let's Encrypt certificate order.
   *
   * Note that the issuance process is async. A successful response means the issuance
   + request has been successfully acknowledged and queued for processing.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#issueLetsencryptCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificatePurchaseId The certificate purchase identifier
   * @param {Object} [options]
   * @return {Promise}
   */
  issueLetsencryptCertificate(accountId, domainId, certificatePurchaseId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/letsencrypt/${certificatePurchaseId}/issue`, null, options);
  }

  /**
   * Purchase a Let's Encrypt certificate renewal.
   *
   * This method creates a new renewal order. The order ID should be used to
   + request the issuance of the certificate using `#issueLetsencryptCertificateRenewal`.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#purchaseRenewalLetsencryptCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate ID to renew
   * @param {Object} [options]
   * @return {Promise}
   */
  purchaseLetsencryptCertificateRenewal(accountId, domainId, certificateId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/letsencrypt/${certificateId}/renewal`, null, options);
  }

  /**
   * Issue a pending Let's Encrypt certificate renewal order.
   +
   + Note that the issuance process is async. A successful response means the issuance
   + request has been successfully acknowledged and queued for processing.
   *
   * @see https://developer.dnsimple.com/v2/certificates/#issueRenewalLetsencryptCertificate
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} oldCertificateId The certificate identifier
   * @param {number} certificateRenewalId The certificate renewal order ID
   * @param {Object} [options]
   * @return {Promise}
   */
  issueLetsencryptCertificateRenewal(accountId, domainId, oldCertificateId, certificateRenewalId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/` +
      `letsencrypt/${oldCertificateId}/renewals/${certificateRenewalId}/issue`,
      null, options);
  }

}

module.exports = Certificates;
