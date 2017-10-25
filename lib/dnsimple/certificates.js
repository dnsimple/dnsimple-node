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
   * Lists the certificate in the account attached to the given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#list
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
   * List ALL the certificates in the account.
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
   * Get a specific certificate associated to a domain using the certificate's ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#get
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
   * Downloads certificate associated with a domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#download
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
   * Get the certificate private key associated with a domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#private-key
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
   * @see https://developer.dnsimple.com/v2/domains/certificates/#letsencrypt-purchase
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {Object} attributes The attributes for the certificate.
   * @param {Object} [options]
   * @return {Promise}
   */
  letsencryptPurchase(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/certificates/letsencrypt`, attributes, options);
  }

  /**
   * Issue a Let's Encrypt certificate.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#letsencrypt-issue
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate identifier
   * @param {Object} [options]
   * @return {Promise}
   */
  letsencryptIssue(accountId, domainId, certificateId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/letsencrypt/${certificateId}/issue`, null, options);
  }

  /**
   * Renew a Let's Encrypt certificate.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#letsencrypt-renewal
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} certificateId The certificate ID to renew
   * @param {Object} [options]
   * @return {Promise}
   */
  letsencryptPurchaseRenew(accountId, domainId, certificateId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/letsencrypt/${certificateId}/renewal`, null, options);
  }

  /**
   * Issue a Let's Encrypt certificate renewal.
   *
   * @see https://developer.dnsimple.com/v2/domains/certificates/#letsencrypt-renewal-issue
   *
   * @param {number} accountId The account ID
   * @param {number|string} domainId The domain identifier (name or numeric ID)
   * @param {number} oldCertificateId The certificate identifier
   * @param {number} certificateRenewalId The certificate renewal order ID
   * @param {Object} [options]
   * @return {Promise}
   */
  letsencryptIssueRenew(accountId, domainId, oldCertificateId, certificateRenewalId, options = {}) {
    return this._client.post(
      `/${accountId}/domains/${domainId}/certificates/` +
      `letsencrypt/${oldCertificateId}/renewals/${certificateRenewalId}/issue`,
      null, options);
  }

}

module.exports = Certificates;
