'use strict';

const Paginate = require('./paginate');

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
   * List ALL the templates in the account.
   *
   * This method is similar to {#listTemplates}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all templates
   * client.templates.allTemplates(1010).then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List all templates, provide a sorting policy
   * client.templates.allTemplates(1010, {sort: 'name:asc'}).then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options] The filtering and sorting options
   * @param {string} [options.sort] The sort definition in the form `key:direction`
   * @return {Promise}
   */
  allTemplates(accountId, options = {}) {
    return new Paginate(this).paginate(this.listTemplates, [accountId, options]);
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
  listTemplateRecords(accountId, templateId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}/records`, options);
  }

  /**
   * List ALL the records in the template.
   *
   * This method is similar to {#listRecords}, but instead of returning the results of a
   * specific page it iterates all the pages and returns the entire collection.
   *
   * Please use this method carefully, as fetching the entire collection will increase the
   * number of requests you send to the API server and you may eventually risk to hit the
   * throttle limit.
   *
   * @example List all template records
   * client.templates.allRecords(1010, 'example.com').then(function(items) {
   *   // use items list
   * }, function(error) {
   *   // handle error
   * });
   *
   * @example List all template records, provide a sorting policy
   * client.templates.allRecords(1010, 'example.com', {sort: 'name:asc'}).then(function(items) {
   *   // use items list
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
  allTemplateRecords(accountId, domainId, options = {}) {
    return new Paginate(this).paginate(this.listTemplateRecords, [accountId, domainId, options]);
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
  getTemplateRecord(accountId, templateId, recordId, options = {}) {
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
  createTemplateRecord(accountId, templateId, attributes, options = {}) {
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
  deleteTemplateRecord(accountId, templateId, recordId, options = {}) {
    return this._client.delete(`/${accountId}/templates/${templateId}/records/${recordId}`, options);
  }
}

module.exports = Templates;
