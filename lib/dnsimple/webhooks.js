class Webhooks {
  constructor(client) {
    this._client = client;
  }

  listWebhooks(accountId, options = {}) {
    return this._client.get(`/${accountId}/webhooks`, options);
  }

  getWebhook(accountId, webhookId, options = {}) {
    return this._client.get(`/${accountId}/webhooks/${webhookId}`, options);
  }

  createWebhook(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/webhooks`, attributes, options);
  }

  deleteWebhook(accountId, webhookId, options = {}) {
    return this._client.delete(`/${accountId}/webhooks/${webhookId}`, options);
  }
}

module.exports = Webhooks;
