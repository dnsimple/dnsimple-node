'use strict';

require('mocha');
require('chai').use(require('chai-as-promised'));

const fs = require('fs');

module.exports = {

  getAccessToken: () => {
    const key = process.env.TOKEN || 'bogus';
    return key;
  },

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
      httpVersion: httpVersion,
      statusCode: statusCode,
      headers: headers,
      reasonPhrase: reasonPhrase,
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
