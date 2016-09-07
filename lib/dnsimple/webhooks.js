'use strict';

/**
 * Provides access to the DNSimple Webhooks API.
 *
 * @see https://developer.dnsimple.com/v2/webhooks
 */
class Webhooks {
  constructor(client) {
    this._client = client;
  }

  /**
   * Lists the webhooks in the account.
   *
   * @see https://developer.dnsimple.com/v2/webhooks/#list
   *
   * @example List webhooks
   * client.webhooks.listWebhooks(1010).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {Object} [options]
   * @return {Promise}
   */
  listWebhooks(accountId, options = {}) {
    return this._client.get(`/${accountId}/webhooks`, options);
  }

  /**
   * List ALL the templates in the account.
   *
   * This method is similar to {#listWebhooks}, but instead of a Promise that emits the
   * response, it returns a Promise that emits the item collection.
   *
   * @param {number} accountId The account ID
   * @param {Object} [options]
   * @return {Promise}
   */
  allWebhooks(accountId, options = {}) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.listWebhooks(accountId, options).then(function(response) {
        resolve(response.data);
      }, function(error) {
        reject(error);
      });
    });
  }

  /**
   * Get a specific webhook associated to an account using the webhook's ID.
   *
   * @see https://developer.dnsimple.com/v2/webhooks/#get
   *
   * @param {number} accountId The account ID
   * @param {number} webhookId The webhook ID
   * @param {Object} [options]
   * @return {Promise}
   */
  getWebhook(accountId, webhookId, options = {}) {
    return this._client.get(`/${accountId}/webhooks/${webhookId}`, options);
  }

  /**
   * Create a webhook in the account.
   *
   * @see https://developer.dnsimple.com/v2/webhooks/#create
   *
   * @param {number} accountId The account ID
   * @param {Object} attributes The webhook attributes
   * @param {Object} [options]
   * @return {Promise}
   */
  createWebhook(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/webhooks`, attributes, options);
  }

  /**
   * Delete a webhook from the account.
   *
   * @see https://developer.dnsimple.com/v2/webhooks/#delete
   *
   * @param {number} accountId The account ID
   * @param {number} webhookId The webhook ID
   * @param {Object} [options]
   * @return {Promise}
   */

  deleteWebhook(accountId, webhookId, options = {}) {
    return this._client.delete(`/${accountId}/webhooks/${webhookId}`, options);
  }
}

module.exports = Webhooks;
