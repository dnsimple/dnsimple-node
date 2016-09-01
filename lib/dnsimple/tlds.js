'use strict';

class Tlds {
  constructor(client) {
    this._client = client;
  }

  listTlds(options = {}) {
    return this._client.get('/tlds', options);
  }

  getTld(tld, options = {}) {
    return this._client.get('/tlds/' + tld, options);
  }

  getExtendedAttributes(tld, options = {}) {
    return this._client.get('/tlds/' + tld + '/extended_attributes', options);
  }

}

module.exports = Tlds;
