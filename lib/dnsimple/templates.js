'use strict';

/**
 * Provides access to the DNSimple Templates API.
 *
 * @see https://developer.dnsimple.com/v2/templates
 */
class Templates {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the templates in the account.
   *
   * @see https://developer.dnsimple.com/v2/templates/#list
   *
   * @example List templates in the first page
   * client.templates.listTemplates(1010).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List templates, provide a specific page
   * client.templates.listTemplates(1010, {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List templates, provide a sorting policy
   * client.templates.listTemplates(1010, {sort: 'name:asc'}).then(function(response) {
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
  listTemplates(accountId, options = {}) {
    return this._client.get(`/${accountId}/templates`, options);
  }

  /**
   * Get a specific template associated to an account using the template's ID.
   *
   * @see https://developer.dnsimple.com/v2/templates/#get
   *
   * @param {number} accountId The account ID
   * @param {number|string} contactId The template ID or short name
   * @param {Object} [options]
   * @return {Promise}
   */
  getTemplate(accountId, templateId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}`, options);
  }

  /**
   * Create a template in the account.
   *
   * @see https://developer.dnsimple.com/v2/templates/#create
   *
   * @param {number} accountId The account ID
   * @param {Object} attributes The template attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createTemplate(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/templates`, attributes, options);
  }

  /**
   * Update a template in the account.
   *
   * @see https://developer.dnsimple.com/v2/templates/#update
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID or short name
   * @param {Object} attributes The template attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  updateTemplate(accountId, templateId, attributes, options = {}) {
    return this._client.patch(`/${accountId}/templates/${templateId}`, attributes, options);
  }

  /**
   * Delete a template from the account.
   *
   * @see https://developer.dnsimple.com/v2/templates/#delete
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteTemplate(accountId, templateId, options = {}) {
    return this._client.delete(`/${accountId}/templates/${templateId}`, options);
  }

  /**
   * Apply a template from the account to the domain
   *
   * @see https://developer.dnsimple.com/v2/domains/templates/#apply
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID or short name
   * @param {number|string} domainId The domain ID or name
   * @param {Object} [options]
   * @return {Promise}
   */
  applyTemplate(accountId, templateId, domainId, options = {}) {
    return this._client.post(`/${accountId}/domains/${domainId}/templates/${templateId}`, null, options);
  }

  /**
   * Lists the records in the template.
   *
   * @see https://developer.dnsimple.com/v2/templates/records/#list
   *
   * @example List records in the template
   * client.templates.listRecords(1010, 'alpha').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List records in the template, provide a specific page
   * client.templates.listRecords(1010, 'alpha' {page: 2}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List records in the template, provide a sorting policy
   * client.templates.listRecords(1010, 'alpha', {sort: 'name:asc'}).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID or short name
   * @param {Object} [options] The filtering and sorting options
   * @param {number} [options.page] The current page number
   * @param {number} [options.per_page] The number of items per page
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  listRecords(accountId, templateId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}/records`, options);
  }

  /**
   * Get a specific record associated to a template using the record's ID.
   *
   * @see https://developer.dnsimple.com/v2/templates/records/#get
   *
   * @param {number} accountId The account ID
   * @param {number|string} contactId The template ID or short name
   * @param {number} recordId The record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getRecord(accountId, templateId, recordId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}/records/${recordId}`, options);
  }

  /**
   * Create a record in the template.
   *
   * @see https://developer.dnsimple.com/v2/templates/records/#create
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID or short name
   * @param {Object} attributes The template attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createRecord(accountId, templateId, attributes, options = {}) {
    return this._client.post(`/${accountId}/templates/${templateId}/records`, attributes, options);
  }

  /**
   * Delete a record from the template.
   *
   * @see https://developer.dnsimple.com/v2/templates/records/#delete
   *
   * @param {number} accountId The account ID
   * @param {number|string} templateId The template ID or short name
   * @param {number} recordId The record ID
   * @param {Object} [options]
   * @return {Promise}
   */
  deleteRecord(accountId, templateId, recordId, options = {}) {
    return this._client.delete(`/${accountId}/templates/${templateId}/records/${recordId}`, options);
  }
}

module.exports = Templates;
