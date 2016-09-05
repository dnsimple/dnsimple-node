'use strict';

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
   * @see https://developer.dnsimple.com/v2/domains/certificates/#download
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
}

module.exports = Certificates;
