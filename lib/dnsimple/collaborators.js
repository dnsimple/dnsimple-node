'use strict';

const Paginate = require('./paginate');

/**
 * Provides access to the DNSimple Collaborators API.
 *
 * @see https://developer.dnsimple.com/v2/domains/collaborators
 * @deprecated Use domains.collaborators
 */
class Collaborators {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the collaborators in the account attached to the given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/collaborators/#list
   *
   * @example List collaborators in the first page
   * client.collaborators.listCollaborators(1010, 'example.com').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List collaborators, provide a specific page
   * client.collaborators.listCollaborators(1010, 'example.com', {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List collaborators, provide a sorting policy
   * client.collaborators.listCollaborators(1010, 'example.com', {sort: 'email:asc'}).then(function(response) {
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
  listCollaborators(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/collaborators`, options);
  }

  /**
   * Add a collaborator to the given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/collaborators/#add
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or ID.
   * @param {Object} [collaborator]
   * @param {Object} [options]
   * @return {Promise}
   */
  addCollaborator(accountId, domainId, collaborator, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/collaborators`, collaborator, options);
  }

  /**
   * Remove a collaborator from the given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/collaborators/#delete
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or ID.
   * @param {number} collaboratorId The collaborator ID
   * @param {Object} [options]
   * @return {Promise}
   */
  removeCollaborator(accountId, domainId, collaboratorId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/collaborators/${collaboratorId}`, options);
  }
}

module.exports = Collaborators;
