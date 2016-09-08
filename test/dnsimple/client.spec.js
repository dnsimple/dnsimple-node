'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('response handling', function() {
  describe('identity.whoami returns a malformed JSON response', function() {
    it('produces an error', function(done) {
      var fixture = testUtils.fixture('badgateway.http');
      nock('https://api.dnsimple.com')
        .get('/v2/whoami')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.identity.whoami().then(function(response) {
        done('Expected error but promise resolved');
      }, function(error) {
        expect(error).to.eq('Unexpected token < in JSON at position 0');
        done();
      });
    });
  });
});
