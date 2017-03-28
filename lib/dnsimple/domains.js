'use strict';

const Paginate = require('./paginate');

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

  /**
   * List ALL the domains in the account.
   *
   * This method is similar to {#listDomains}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all domains
   * client.domains.allDomains(1010).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List domains, provide a sorting policy
   * client.domains.allDomains(1010, {sort: 'name:asc'}).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List domains, provide a filtering policy
   * client.domains.allDomains(1010, {name_like: 'example'}).then(function(items) {
   *   // use items
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @param {string} [options.name_like] Filter domains where the name is like the given string
   * @param {string} [options.registrant_id] Filter only domains with the given registrant ID
   * @return {Promise}
   */
  allDomains(accountId, options = {}) {
    return new Paginate(this).paginate(this.listDomains, [accountId, options]);
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

  /**
   * Enable DNSSEC for the domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#enable
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  enableDnssec(accountId, domainId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/dnssec`, null, options);
  }

  /**
   * Disable DNSSEC for the domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#disable
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  disableDnssec(accountId, domainId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/dnssec`, options);
  }

  /**
   * Get the DNSSEC status for the domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getDnssec(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/dnssec`, options);
  }

  /**
   * List delegation signer records under a given domain.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#ds-record-list
   *
   * @example List delegation signer records under a domain in the first page
   * client.domains.listDelegationSignerRecords(1010, 'example.com').then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List delegation signer records under a domain, provide a specific page
   * client.domains.listDelegationSignerRecords(1010, 'example.com', {page: 2}).then(function(response) {
   *   # handle response
   * }, function(error) {
   *   # handle error
   * });
   *
   * @example List delegation signer records under a domain, provide a sorting policy
   * client.domains.listDelegationSignerRecords(1010, 'example.com', {sort: 'from:asc'}).then(function(response) {
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
  listDelegationSignerRecords(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/ds_records`, options);
  }

  /**
   * List ALL the delegation signer records in the account.
   *
   * This method is similar to {#listDelegationSignerRecords}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all delegation signer records
   * client.domains.allDelegationSignerRecords(1010, 'example.com').then(function(ds_records) {
   *   // use delegation signer record list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List delegation signer records, provide a sorting policy
   * client.domains.allDelegationSignerRecords(1010, 'example.com', {sort: 'from:asc'}).then(function(ds_records) {
   *   // use delegation signer record list
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
  allDelegationSignerRecords(accountId, domainId, options = {}) {
    return new Paginate(this).paginate(this.listDelegationSignerRecords, [accountId, domainId, options]);
  }

  /**
   * Get a specific delegation signer record associated to a domain and account using the delegation
   * signer record ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#ds-record-get
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {number} delegationSignerRecordId The delegation signer record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getDelegationSignerRecord(accountId, domainId, delegationSignerRecordId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/ds_records/${delegationSignerRecordId}`, options);
  }

  /**
   * Create a delegation signer record associated to a domain and account.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#ds-record-create
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} attributes The delegation signer record attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createDelegationSignerRecord(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/ds_records`, attributes, options);
  }

  /**
   * Delete a specific delegation signer record associated from a domain and account using the
   * delegation signer record ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/dnssec/#ds-record-delete
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {number} delegationSignerRecordId The delegation signer record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteDelegationSignerRecord(accountId, domainId, delegationSignerRecordId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/ds_records/${delegationSignerRecordId}`, options);
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
   * List ALL the email forwards in the account.
   *
   * This method is similar to {#listEmailForwards}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all email forwards
   * client.domains.allEmailForwards(1010, 'example.com').then(function(email_forwards) {
   *   // use email forward list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List email forwards, provide a sorting policy
   * client.domains.allEmailForwards(1010, 'example.com', {sort: 'from:asc'}).then(function(email_forwards) {
   *   // use email forward list
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
  allEmailForwards(accountId, domainId, options = {}) {
    return new Paginate(this).paginate(this.listEmailForwards, [accountId, domainId, options]);
  }

  /**
   * Get a specific email forward associated to a domain and account using the email forward ID.
   *
   * @see https://developer.dnsimple.com/v2/domains/email-forwards/#get
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {number} emailForwardId The email forward ID
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
   * @param {number} emailForwardId The email forward ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteEmailForward(accountId, domainId, emailForwardId, options = {}) {
    return this._client.delete(`/${accountId}/domains/${domainId}/email_forwards/${emailForwardId}`, options);
  }

  /**
   * Initiate a push from one DNSimple account to another.
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#initiate
   *
   * @param {number} accountId The account ID
   * @param {string|number} domainId The domain name or numeric ID
   * @param {Object} attributes The push attributes
   * @param {string} attributes.new_account_email The email address of the account to push to
   * @param {number} [attributes.contact_id] The contact to associate the domain to if registered
   * @param {Object} [options]
   * @return {Promise}
   */
  initiatePush(accountId, domainId, attributes, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/pushes`, attributes, options);
  }

  /*
   * List pending pushes for the given account.
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#list
   *
   * @param {number} accountId The account ID
   * @param {Object} [options]
   * @return {Promise}
   */
  listPushes(accountId, options = {}) {
    return this._client.get(`/${accountId}/pushes`, options);
  }

  /*
   * Accept a pending push.
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#accept
   *
   * @param {number} accountId The account ID
   * @param {number} pushId The push ID
   * @param {Object} attributes
   * @param {number} attributes.contact_id The contact ID for the domain in the new account
   * @param {Object} [options]
   * @return {Promise}
   */
  acceptPush(accountId, pushId, attributes, options = {}) {
    return this._client.post(`/${accountId}/pushes/${pushId}`, attributes, options);
  }

  /*
   * Reject a pending push.
   *
   * @see https://developer.dnsimple.com/v2/domains/pushes/#reject
   *
   * @param {number} accountId The account ID
   * @param {number} pushId The push ID
   * @param {Object} [options]
   * @return {Promise}
   */
  rejectPush(accountId, pushId, options = {}) {
    return this._client.delete(`/${accountId}/pushes/${pushId}`, options);
  }
}

module.exports = Domains;
