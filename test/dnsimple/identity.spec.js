'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

var expect = require('chai').expect;
var nock = require('nock');
var fixture = testUtils.fixture('whoami/success.http');
var endpoint = nock('https://api.dnsimple.com')
                 .get('/v2/whoami')
                 .reply(fixture.statusCode, fixture.body);

describe('identity', function() {
  describe('#whoami', function() {
    it('produces an account', function(done) {
      dnsimple.identity.whoami(function(error, response) {
        expect(error).to.be.null;
        var account = response.data.account;
        expect(account.id).to.eql(1);
        expect(account.email).to.eql('example-account@example.com');
        done();
      });
    });
  });
});
