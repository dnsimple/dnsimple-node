'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domain services', function() {
  describe('#appliedServices', function() {
    var accountId = '1010';
    var domainId = 'example.com'
    var fixture = testUtils.fixture('appliedServices/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId, {sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('produces a service list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.appliedServices(accountId, domainId).then(function(response) {
        var services = response.data;
        expect(services.length).to.eq(1);
        expect(services[0].name).to.eq('WordPress');
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allAppliedServices', function() {
    var accountId = '1010';
    var domainId = 'example.com'

    it('produces a complete list', function(done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/services?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.allAppliedServices(accountId, domainId).then(function(items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function(error) {
        done(error);
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('#applyService', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var serviceId = 'name';

    it('produces nothing', function(done) {
      var fixture = testUtils.fixture('applyService/created.http');

      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/services/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId, serviceId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#unapplyService', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var serviceId = 'name';

    it('produces nothing', function(done) {
      var fixture = testUtils.fixture('unapplyService/success.http');

      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/services/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.unapplyService(accountId, domainId, serviceId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
