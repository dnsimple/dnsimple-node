'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const Client = require('../../lib/dnsimple/client');

const expect = require('chai').expect;
const nock = require('nock');

describe('response handling', function() {
  describe('identity.whoami returns a malformed JSON response', function() {
    it('produces an error', function(done) {
      let fixture = testUtils.fixture('badgateway.http');
      nock('https://api.dnsimple.com')
        .get('/v2/badgateway')
        .reply(fixture.statusCode, fixture.body);

      new Client(dnsimple).get('/badgateway', {}).then(function(response) {
        done('Expected error but promise resolved');
      }, function(error) {
        expect(error).to.eq('Unexpected token < in JSON at position 0');
        done();
      });
    });
  });
});
