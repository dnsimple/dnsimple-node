'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});
var expect = require('chai').expect;
var nock = require('nock');

describe('identity', function() {
  describe('#whoami when authenticated as account', function() {
    var fixture = testUtils.fixture('whoami/success_account.http');
    var endpoint = nock('https://api.dnsimple.com')
                     .get('/v2/whoami')
                     .reply(fixture.statusCode, fixture.body);

    it('produces an account', function(done) {
      dnsimple.identity.whoami({}, function(error, response) {
        expect(error).to.be.null;
        expect(response.data.user).to.be.null;
        var account = response.data.account;
        expect(account.id).to.eql(1);
        expect(account.email).to.eql('example-account@example.com');
        done();
      });
    });
  });

  describe('#whoami when authenticated as user', function() {
    var fixture = testUtils.fixture('whoami/success_user.http');
    var endpoint = nock('https://api.dnsimple.com')
                     .get('/v2/whoami')
                     .reply(fixture.statusCode, fixture.body);

    it('produces a user', function(done) {
      dnsimple.identity.whoami({}, function(error, response) {
        expect(error).to.be.null;
        expect(response.data.account).to.be.null;
        var user = response.data.user;
        expect(user.id).to.eql(1);
        expect(user.email).to.eql('example-user@example.com');
        done();
      });
    });
  });
});
