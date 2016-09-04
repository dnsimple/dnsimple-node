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
