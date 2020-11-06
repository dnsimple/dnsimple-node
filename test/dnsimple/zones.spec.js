'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('zones', function () {
  describe('#listZones', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('listZones/success.http');

    it('supports pagination', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?sort=expires_on%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { sort: 'expires_on:asc' });

      nock.isDone();
      done();
    });

    it('supports filter', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { filter: { name_like: 'example' } });

      nock.isDone();
      done();
    });

    it('produces a zone list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(function (response) {
        const zones = response.data;
        expect(zones.length).to.eq(2);
        expect(zones[0].name).to.eq('example-alpha.com');
        expect(zones[0].account_id).to.eq(1010);
        done();
      }, function (error) {
        done(error);
      });
    });

    it('exposes the pagination info', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(function (response) {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allZones', function () {
    const accountId = '1010';

    it('produces a complete list', function (done) {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.zones.allZones(accountId).then(function (items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function (error) {
        done(error);
      }).catch(function (error) {
        done(error);
      });
    });
  });

  describe('#getZone', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('getZone/success.http');

    it('produces a zone', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example-alpha.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZone(accountId, 'example-alpha.com').then(function (response) {
        const zone = response.data;
        expect(zone.id).to.eq(1);
        expect(zone.account_id).to.eq(1010);
        expect(zone.name).to.eq('example-alpha.com');
        expect(zone.reverse).to.eq(false);
        expect(zone.created_at).to.eq('2015-04-23T07:40:03Z');
        expect(zone.updated_at).to.eq('2015-04-23T07:40:03Z');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the zone does not exist', function () {
      const fixture = testUtils.fixture('notfound-zone.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.getZone(accountId, 'example.com').then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Zone `0` not found');
          done();
        });
      });
    });
  });

  describe('#getZoneFile', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('getZoneFile/success.http');

    it('produces a zone file', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example-alpha.com/file')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZoneFile(accountId, 'example-alpha.com').then(function (response) {
        const zone = response.data;
        expect(zone).to.not.eq(null);
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the zone file does not exist', function () {
      const fixture = testUtils.fixture('notfound-zone.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/file')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.getZoneFile(accountId, 'example.com').then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#checkZoneDistribution', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('checkZoneDistribution/success.http');

    it('returns true when the zone is fully distributed', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example-alpha.com/distribution')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.checkZoneDistribution(accountId, 'example-alpha.com').then(function (response) {
        const zone = response.data;
        expect(zone).to.not.eq(null);
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('returns false when the zone is not fully distributed', function () {
      const fixture = testUtils.fixture('checkZoneDistribution/failure.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneDistribution(accountId, 'example.com').then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('returns an error when the server was not able to complete the check', function () {
      const fixture = testUtils.fixture('checkZoneDistribution/error.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneDistribution(accountId, 'example.com').then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('when the zone does not exist', function () {
      const fixture = testUtils.fixture('notfound-zone.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneDistribution(accountId, 'example.com').then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#checkZoneRecordDistribution', function () {
    const accountId = '1010';
    const recordId = 1;
    const fixture = testUtils.fixture('checkZoneRecordDistribution/success.http');

    it('returns true when the zone record is fully distributed', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example-alpha.com/records/1/distribution')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.checkZoneRecordDistribution(accountId, 'example-alpha.com', recordId).then(function (response) {
        const zone = response.data;
        expect(zone).to.not.eq(null);
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('returns false when the zone record is not fully distributed', function () {
      const fixture = testUtils.fixture('checkZoneRecordDistribution/failure.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/1/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneRecordDistribution(accountId, 'example.com', recordId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('returns an error when the server was not able to complete the check', function () {
      const fixture = testUtils.fixture('checkZoneRecordDistribution/error.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/1/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneRecordDistribution(accountId, 'example.com', recordId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('when the zone does not exist', function () {
      const fixture = testUtils.fixture('notfound-zone.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/1/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneRecordDistribution(accountId, 'example.com', recordId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('when the zone record does not exist', function () {
      const fixture = testUtils.fixture('notfound-record.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/1/distribution')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.zones.checkZoneRecordDistribution(accountId, 'example.com', recordId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });
});
