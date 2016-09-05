'use strict';

const Paginate = require('./paginate');

/**
 * Provide access to the DNSimple Contacts API.
 *
 * @see https://developer.dnsimple.com/v2/contacts
 */
class Contacts {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the contacts in the account.
   *
   * @see https://developer.dnsimple.com/v2/contacts/#list
   *
   * @example List contacts in the first page
   * client.contacts.listContacts(1010).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List contacts, provide a specific page
   * client.contacts.listContacts(1010, {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List contacts, provide a sorting policy
   * client.contacts.listContacts(1010, {sort: 'email:asc'}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listContacts(accountId, options = {}) {
    return this._client.get(`/${accountId}/contacts`, options);
  }

  /**
   * List ALL the contacts in the account.
   *
   * This method is similar to {#listContacts}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all contacts
   * client.contacts.allContacts(1010).then(function(contacts) {
   *   // use contacts list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List contacts, provide a sorting policy
   * client.contacts.allContacts(1010, {sort: 'name:asc'}).then(function(contacts) {
   *   // use contacts list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allContacts(accountId, options = {}) {
    return new Paginate(this).paginate(this.listContacts, [accountId, options]);
  }

  /**
   * Get a specific contact associated to an account using the contact's ID.
   *
   * @see https://developer.dnsimple.com/v2/contacts/#get
   *
   * @param {number} accountId The account ID
   * @param {number} contactId The contact ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getContact(accountId, contactId, options = {}) {
    return this._client.get(`/${accountId}/contacts/${contactId}`, options);
  }

  /**
   * Create a contact in the account.
   *
   * @see https://developer.dnsimple.com/v2/contacts/#create
   *
   * @param {number} accountId The account ID
   * @param {Object} attributes The contact attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createContact(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/contacts`, attributes, options);
  }

  /**
   * Update a contact in the account.
   *
   * @see https://developer.dnsimple.com/v2/contacts/#update
   *
   * @param {number} accountId The account ID
   * @param {number} contactId The contact ID
   * @param {Object} attributes The updated contact attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  updateContact(accountId, contactId, attributes, options = {}) {
    return this._client.patch(`/${accountId}/contacts/${contactId}`, attributes, options);
  }

  /**
   * Delete a contact from the account.
   *
   * @see https://developer.dnsimple.com/v2/contacts/#delete
   *
   * @param {number} accountId The account ID
   * @param {number} contactId The contact ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteContact(accountId, contactId, options = {}) {
    return this._client.delete(`/${accountId}/contacts/${contactId}`, options);
  }
}

module.exports = Contacts;
