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
      dnsimple.identity.whoami(function(error, account) {
        expect(error).to.be.null;
        expect(account).to.eql({id: 1});
        done();
      });
    });
  });
});
