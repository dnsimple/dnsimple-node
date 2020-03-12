'use strict';

require('mocha');
require('chai').use(require('chai-as-promised'));

const fs = require('fs');

module.exports = {

  getAccessToken: function () {
    var key = process.env.TOKEN || 'bogus';
    return key;
  },

  fixture: function (path) {
    var data = fs.readFileSync('./test/fixtures.http/' + path, { encoding: 'UTF8' });
    var lines = data.split(/\r?\n/);

    var statusLine = lines.shift();
    var statusParts = statusLine.split(/\s+/);
    var httpVersion = statusParts[0];
    var statusCode = parseInt(statusParts[1]);
    var reasonPhrase = statusParts[2];

    var headers = {};
    var val;
    while ((val = lines.shift()) !== '') {
      var pair = val.split(/:\s/);
      headers[pair[0]] = pair[1];
    }

    var fixture = {
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
