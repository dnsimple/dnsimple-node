'use strict';

class Accounts {
  constructor(client) {
    this._client = client;
  }

  listAccounts(options = {}) {
    return this._client.get('/accounts', options);
  }
}

module.exports = Accounts;
