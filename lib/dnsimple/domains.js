'use strict';

/**
 * Provides access to the DNSimple Domains API.
 *
 * @see https://developer.dnsimple.com/v2/domains
 */
class Domains {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the domains in the account.
   *
   * @see https://developer.dnsimple.com/v2/domains/#list
   *
   * @example List domains in the first page
   * client.domains.listDomains(1010).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List domains, provide a specific page
   * client.domains.listDomains(1010, {page: 2}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List domains, provide a sorting policy
   * client.domains.listDomains(1010, {sort: 'name:asc'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List domains, provide a filtering policy
   * client.domains.listDomains(1010, {name_like: 'example'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @param {string} [options.name_like] Filter domains where the name is like the given string
   * @param {string} [options.registrant_id] Filter only domains with the given registrant ID
   * @return {Promise}
   */
  listDomains(accountId, options = {}) {
    return this._client.get(`/${accountId}/domains`, options);
  }

  allDomains(accountId, options = {}) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self._nextPage(accountId, 1, options = {}).then(function(responses) {
        let extractData = function(response) { return response.data; };
        let domains = [].concat.apply([], responses.map(extractData));

        resolve.call(self, domains);
      });
    });
  }

  _nextPage(accountId, page, options = {}) {
    var self = this;
    return new Promise(function(resolve, reject) {
      Object.assign(options, {page: page});
      self.listDomains(accountId, options).then(function(response) {
        if (page < response.pagination.total_pages) {
          return new Promise(function(resolve, reject) {
            // Recursively call _nextPage while incrementing the page number
            self._nextPage(accountId, page + 1, options).then(function(nextResponse) {
              resolve.call(self, nextResponse);
            });
          }).then(function(responses) {
            resolve.call(self, [response].concat(responses));
          });
        }
        // No more pages left
        resolve.call(self, [response]);
      });
    });
  }

  /**
   * Get a specific domain associated to an account using the domain's name or ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getDomain(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}`, options);
  }

  /**
   * Create a domain in an account.
   *
   * @see https://developer.dnsimple.com/v2/domains/#create
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createDomain(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains`, attributes, options);
  }

  /**
   * Delete a domain from an account.
   *
   * WARNING: this cannot be undone.
   *
   * @see https://developer.dnsimple.com/v2/domains/#delete
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteDomain(accountId, domainId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}`, options);
  }

  /**
   * Resets the domain token.
   *
   * @see https://developer.dnsimple.com/v2/domains/#reset-token
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  resetDomainToken(accountId, domainId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/token`, null, options);
  }

  /**
   * List email forwards under a given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#list
   *
   * @example List email forwards under a domain in the first page
   * client.domains.listEmailForwards(1010, 'example.com').then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List email forwards under a domain, provide a specific page
   * client.domains.listEmailForwards(1010, 'example.com', {page: 2}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List email forwards under a domain, provide a sorting policy
   * client.domains.listEmailForwards(1010, 'example.com', {sort: 'from:asc'}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listEmailForwards(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/email_forwards`, options);
  }

  /**
   * Get a specific email forward associated to a domain and account using the email forward ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {number} emailForwardID The email forward ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getEmailForward(accountId, domainId, emailForwardId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/email_forwards/${emailForwardId}`, options);
  }

  /**
   * Create an email forward associated to a domain and account.
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#create
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} attributes The email forward attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createEmailForward(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/email_forwards`, attributes, options);
  }

  /**
   * Delete a specific email forward associated from a domain and account using the email forward ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#delete
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {number} emailForwardID The email forward ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteEmailForward(accountId, domainId, emailForwardId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/email_forwards/${emailForwardId}`, options);
  }
}

module.exports = Domains;
