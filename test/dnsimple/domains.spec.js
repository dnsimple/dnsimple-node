'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domains', function() {
  describe('#listDomains', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listDomains/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains?sort=expires_on%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, {sort: 'expires_on:asc'});

      endpoint.done();
      done();
    });

    it('supports filter', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains?name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, {filter: {name_like: 'example'}});

      endpoint.done();
      done();
    });

    it('produces a domain list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId).then(function(response) {
        var domains = response.data;
        expect(domains.length).to.eq(2);
        expect(domains[0].name).to.eq('example-alpha.com');
        expect(domains[0].account_id).to.eq(1010);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#domain', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('getDomain/success.http');

    it('produces a domain', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example-alpha.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.domain(accountId, 'example-alpha.com').then(function(response) {
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
      }, function(error) {
        done(error);
      });
    });

    describe('when the domain does not exist', function() {
      var fixture = testUtils.fixture('notfound-domain.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.domains.domain(accountId, 'example.com').then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#createDomain', function() {
    var accountId = '1010';
    var attributes = {name: 'example-alpha.com'};
    var fixture = testUtils.fixture('createDomain/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/domains', {name: 'example-alpha.com'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createDomain(accountId, attributes);

      endpoint.done();
      done();
    });

    it('produces a domain', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createDomain(accountId, attributes).then(function(response) {
        var domain = response.data;
        expect(domain.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#deleteDomain', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('deleteDomain/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.deleteDomain(accountId, 'example.com').then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#resetDomainToken', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('resetDomainToken/success.http');

    it('produces a domain', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/token')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.resetDomainToken(accountId, 'example.com').then(function(response) {
        var domain = response.data
        expect(domain.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });

  });

});
