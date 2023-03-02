'use strict';

require('mocha');
require('chai').use(require('chai-as-promised'));

const DNSimple = require('../lib/dnsimple');
const fs = require('fs');
const sinon = require('sinon');

const getAccessToken = () => process.env.TOKEN || 'bogus';

module.exports = {
  createTestClient: () => new DNSimple({
    accessToken: getAccessToken()
  }),

  stubRequest: (client) => {
    const stub = sinon.stub();
    client.registrar._client.request = stub;
    return stub;
  },

  getAccessToken,

  fixture: (path) => {
    const data = fs.readFileSync('./test/fixtures.http/' + path, { encoding: 'UTF8' });
    const lines = data.split(/\r?\n/);

    const statusLine = lines.shift();
    const statusParts = statusLine.split(/\s+/);
    const httpVersion = statusParts[0];
    const statusCode = parseInt(statusParts[1]);
    const reasonPhrase = statusParts[2];

    const headers = {};
    let val;
    while ((val = lines.shift()) !== '') {
      const pair = val.split(/:\s/);
      headers[pair[0]] = pair[1];
    }

    const fixture = {
      httpVersion,
      statusCode,
      headers,
      reasonPhrase,
      body: null
    };

    if (statusCode !== 204) {
      if (headers['Content-Type'] === 'application/json') {
        fixture.body = JSON.parse(lines.join('\n'));
      } else {
        fixture.body = lines.join('\n');
      }
    }

    return fixture;
  }

};
