'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('zones', function() {
  describe('#listZones', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listZones/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?sort=expires_on%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, {sort: 'expires_on:asc'});

      endpoint.done();
      done();
    });

    it('supports filter', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones?name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, {filter: {name_like: 'example'}});

      endpoint.done();
      done();
    });

    it('produces a zone list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(function(response) {
        var zones = response.data;
        expect(zones.length).to.eq(2);
        expect(zones[0].name).to.eq('example-alpha.com');
        expect(zones[0].account_id).to.eq(1010);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#zone', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('getZone/success.http');

    it('produces a zone', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example-alpha.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.zone(accountId, 'example-alpha.com').then(function(response) {
        var zone = response.data;
        expect(zone.id).to.eq(1);
        expect(zone.account_id).to.eq(1010);
        expect(zone.name).to.eq('example-alpha.com');
        expect(zone.reverse).to.be.false;
        expect(zone.created_at).to.eq('2015-04-23T07:40:03.045Z');
        expect(zone.updated_at).to.eq('2015-04-23T07:40:03.051Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the zone does not exist', function() {
      var fixture = testUtils.fixture('notfound-zone.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.zones.zone(accountId, 'example.com').then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });
});
