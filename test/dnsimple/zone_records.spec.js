'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('zone records', function() {
  describe('#listZoneRecords', function() {
    var accountId = '1010';
    var zoneId = 'example.com';
    var fixture = testUtils.fixture('listZoneRecords/success.http');

    it('supports pagination', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {page: 1});

      nock.isDone();
      done();
    });

    it('supports extra request options', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {query: {foo: 'bar'}});

      nock.isDone();
      done();
    });

    it('supports sorting', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {sort: 'name:asc'});

      nock.isDone();
      done();
    });

    it('supports filter', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {filter: {name_like: 'example'}});

      nock.isDone();
      done();
    });

    it('produces a record list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId).then(function(response) {
        var records = response.data;
        expect(records.length).to.eq(5);
        expect(records[0].id).to.eq(1);
        expect(records[0].zone_id).to.eq(zoneId);
        expect(records[0].name).to.eq('');
        expect(records[0].content).to.eq('ns1.dnsimple.com admin.dnsimple.com 1458642070 86400 7200 604800 300');
        expect(records[0].ttl).to.eq(3600);
        expect(records[0].priority).to.be.null;
        expect(records[0].type).to.eq('SOA');
        expect(records[0].system_record).to.be.true;
        expect(records[0].created_at).to.eq('2016-03-22T10:20:53Z');
        expect(records[0].updated_at).to.eq('2016-10-05T09:26:38Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get(`/v2/1010/zones/${zoneId}/records`)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allZoneRecords', function() {
    var accountId = '1010';
    var zoneId = 'example.com';

    it('produces a complete list', function(done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.zones.allZoneRecords(accountId, zoneId).then(function(items) {
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

  describe('#getZoneRecord', function() {
    var accountId = '1010';
    var zoneId = 'example.com';
    var fixture = testUtils.fixture('getZoneRecord/success.http');

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/64784')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZoneRecord(accountId, zoneId, 64784).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(5);
        expect(record.regions.length).to.eq(2);
        expect(record.regions[0]).to.eq('SV1');
        expect(record.regions[1]).to.eq('IAD');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the record does not exist', function() {
      var fixture = testUtils.fixture('notfound-record.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.zones.getZoneRecord(accountId, zoneId, '0').then(function(response) {
          done('Error expected but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Record `0` not found');
          done();
        });
      });
    });
  });

  describe('#createZoneRecord', function() {
    var accountId = '1010';
    var zoneId = 'example.com';
    var attributes = {name: '', type: 'A', ttl: 3600, content: '1.2.3.4'};
    var fixture = testUtils.fixture('createZoneRecord/created.http');

    it('builds the correct request', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/zones/example.com/records', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createZoneRecord(accountId, zoneId, attributes);

      nock.isDone();
      done();
    });

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/zones/example.com/records', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createZoneRecord(accountId, zoneId, attributes).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#updateZoneRecord', function() {
    var accountId = '1010';
    var zoneId = 'example.com';
    var recordId = 64784;
    var attributes = {content: '127.0.0.1'};
    var fixture = testUtils.fixture('updateZoneRecord/success.http');

    it('builds the correct request', function(done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/zones/example.com/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes);

      nock.isDone();
      done();
    });

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/zones/example.com/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(5);
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the record does not exist', function() {
      var fixture = testUtils.fixture('notfound-record.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#deleteZoneRecord', function() {
    var accountId = '1010';
    var zoneId = 'example.com';
    var recordId = 64784;
    var fixture = testUtils.fixture('deleteZoneRecord/success.http');

    it('builds the correct request', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/zones/example.com/records/' + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId);

      nock.isDone();
      done();
    });

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/zones/example.com/records/' + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the record does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-record.http');
        nock('https://api.dnsimple.com')
          .delete('/v2/1010/zones/example.com/records/' + recordId)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId).then(function(response) {
          done('Error expected but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });

  });
});
