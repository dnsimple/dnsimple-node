'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

var expect = require('chai').expect;
var nock = require('nock');

describe('domains', function() {
  describe('#listDomains', function() {
    var fixture = testUtils.fixture('listDomains/success.http');
    var endpoint = nock('https://api.dnsimple.com')
                     .get('/v2/1010/domains')
                     .reply(fixture.statusCode, fixture.body);

    it('produces a domain list', function(done) {
      var accountId = '1010'
      dnsimple.domains.listDomains(accountId, function(error, response) {
        expect(error).to.be.null;
        var domains = response.data;
        expect(domains.length).to.eq(2);
        expect(domains[0].name).to.eq('example-alpha.com');
        expect(domains[0].account_id).to.eq(1010);
        done();
      });
    });
  });

  describe('#domain', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('getDomain/success.http');
    var endpoint = nock('https://api.dnsimple.com')
                     .get('/v2/1010/domains/example-alpha.com')
                     .reply(fixture.statusCode, fixture.body);

    it('produces a domain', function(done) {
      var domainId = 'example-alpha.com';
      dnsimple.domains.domain(accountId, domainId, function(error, response) {
        expect(error).to.be.null;
        var domain = response.data;
        expect(domain.id).to.eq(1);
        expect(domain.account_id).to.eq(1010);
        expect(domain.registrant_id).to.be.null;
        expect(domain.name).to.eq('example-alpha.com');
        expect(domain.state).to.eq('hosted');
        expect(domain.auto_renew).to.eq(false);
        expect(domain.private_whois).to.eq(false);
        expect(domain.expires_on).to.be.null;
        expect(domain.created_at).to.eq('2014-12-06T15:56:55.573Z');
        expect(domain.updated_at).to.eq('2015-12-09T00:20:56.056Z');
        done();
      });
    });

    describe('when the domain does not exist', function() {
      var fixture = testUtils.fixture('notfound-domain.http');
      var endpoint = nock('https://api.dnsimple.com')
                       .get('/v2/1010/domains/example.com')
                       .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.domains.domain(accountId, 'example.com', function(error, response) {
          expect(error).to.not.be.null
          done();
        });
      });
    });

  });
});
