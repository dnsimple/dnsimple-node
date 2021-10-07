'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('services', () => {
  describe('#listServices', () => {
    const fixture = testUtils.fixture('listServices/success.http');

    it('supports pagination', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ sort: 'name:asc' });

      nock.isDone();
      done();
    });

    it('produces a service list', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then((response) => {
        const services = response.data;
        expect(services.length).to.eq(2);
        expect(services[0].name).to.eq('Service 1');
        expect(services[0].sid).to.eq('service1');
        done();
      }, (error) => {
        done(error);
      });
    });

    it('exposes the pagination info', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then((response) => {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#allServices', () => {
    it('produces a complete list', (done) => {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/services?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.allServices().then((items) => {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, (error) => {
        done(error);
      }).catch((error) => {
        done(error);
      });
    });
  });

  describe('#getService', () => {
    const serviceId = 1;
    const fixture = testUtils.fixture('getService/success.http');

    it('produces a service', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/services/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.getService(serviceId).then((response) => {
        const service = response.data;
        expect(service.id).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
