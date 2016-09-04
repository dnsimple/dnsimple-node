class Templates {
  constructor(client) {
    this._client = client;
  }

  listTemplates(accountId, options = {}) {
    return this._client.get(`/${accountId}/templates`, options);
  }

  getTemplate(accountId, templateId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}`, options);
  }

  createTemplate(accountId, attributes, options = {}) {
    return this._client.post(`/${accountId}/templates`, attributes, options);
  }

  updateTemplate(accountId, templateId, attributes, options = {}) {
    return this._client.patch(`/${accountId}/templates/${templateId}`, attributes, options);
  }

  deleteTemplate(accountId, templateId, options = {}) {
    return this._client.delete(`/${accountId}/templates/${templateId}`, options);
  }

  listRecords(accountId, templateId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}/records`, options);
  }

  getRecord(accountId, templateId, recordId, options = {}) {
    return this._client.get(`/${accountId}/templates/${templateId}/records/${recordId}`, options);
  }

  createRecord(accountId, templateId, attributes, options = {}) {
    return this._client.post(`/${accountId}/templates/${templateId}/records`, attributes, options);
  }

  deleteRecord(accountId, templateId, recordId, options = {}) {
    return this._client.delete(`/${accountId}/templates/${templateId}/records/${recordId}`, options);
  }
}

module.exports = Templates;
