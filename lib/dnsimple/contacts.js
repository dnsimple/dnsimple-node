'use strict';

class Contacts {
  constructor(client) {
    this._client = client;
  }

  listContacts(accountId, options = {}) {
    return this._client.get('/' + accountId + '/contacts', options);
  }

  getContact(accountId, contactId, options = {}) {
    return this._client.get('/' + accountId + '/contacts/' + contactId, options);
  }

  createContact(accountId, attributes, options = {}) {
    return this._client.post('/' + accountId + '/contacts', attributes, options);
  }

  updateContact(accountId, contactId, attributes, options = {}) {
    return this._client.patch('/' + accountId + '/contacts/' + contactId, attributes, options);
  }

  deleteContact(accountId, contactId, options = {}) {
    return this._client.delete('/' + accountId + '/contacts/' + contactId, options);
  }
}

module.exports = Contacts;
