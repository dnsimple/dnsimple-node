'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('services', function() {
  describe('#listServices', function() {
    var fixture = testUtils.fixture('listServices/success.http');

    it('supports pagination', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({page: 1});

      nock.isDone();
      done();
    });

    it('supports extra request options', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({query: {foo: 'bar'}});

      nock.isDone();
      done();
    });

    it('supports sorting', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({sort: 'name:asc'});

      nock.isDone();
      done();
    });

    it('produces a service list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(function(response) {
        var services = response.data;
        expect(services.length).to.eq(2);
        expect(services[0].name).to.eq('Service 1');
        expect(services[0].sid).to.eq('service1');
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allServices', function() {
    it('produces a complete list', function(done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.allServices().then(function(items) {
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

  describe('#getService', function() {
    var serviceId = 1;
    var fixture = testUtils.fixture('getService/success.http');

    it('produces a service', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.getService(serviceId).then(function(response) {
        var service = response.data;
        expect(service.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
