'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('registrar auto renewal', function() {
  let accountId = '1010';
  let domainId = 'example.com';

  describe('#enableAutoRenewal', function() {
    var fixture = testUtils.fixture('enableAutoRenewal/success.http');

    it('produces an empty result', function(done) {
      nock('https://api.dnsimple.com')
        .put('/v2/1010/registrar/domains/example.com/auto_renewal')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.enableAutoRenewal(accountId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the domain does not exist', function() {
      it('results in an error', function(done) {
        var fixture = testUtils.fixture('notfound-domain.http');

        nock('https://api.dnsimple.com')
          .put('/v2/1010/registrar/domains/example.com/auto_renewal')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableAutoRenewal(accountId, domainId).then(function(response) {
          done('Expected error but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#disableAutoRenewal', function() {
    var fixture = testUtils.fixture('disableAutoRenewal/success.http');

    it('produces an empty result', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/registrar/domains/example.com/auto_renewal')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableAutoRenewal(accountId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the domain does not exist', function() {
      it('results in an error', function(done) {
        var fixture = testUtils.fixture('notfound-domain.http');

        nock('https://api.dnsimple.com')
          .delete('/v2/1010/registrar/domains/example.com/auto_renewal')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.disableAutoRenewal(accountId, domainId).then(function(response) {
          done('Expected error but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });
});
