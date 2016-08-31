'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('zone records', function() {
  describe('#listRecords', function() {
    var accountId = '1010';
    var zoneName = 'example.com';
    var fixture = testUtils.fixture('listZoneRecords/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName, {sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('supports filter', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records?name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName, {filter: {name_like: 'example'}});

      endpoint.done();
      done();
    });

    it('produces a record list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName).then(function(response) {
        var records = response.data;
        expect(records.length).to.eq(5);
        expect(records[0].id).to.eq(64779);
        expect(records[0].zone_id).to.eq('example.com');
        expect(records[0].name).to.eq('');
        expect(records[0].content).to.eq('ns1.dnsimple.com admin.dnsimple.com 1452184205 86400 7200 604800 300');
        expect(records[0].ttl).to.eq(3600);
        expect(records[0].priority).to.be.null;
        expect(records[0].type).to.eq('SOA');
        expect(records[0].system_record).to.be.true;
        expect(records[0].created_at).to.eq('2016-01-07T16:30:05.379Z');
        expect(records[0].updated_at).to.eq('2016-01-07T16:30:05.379Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listRecords(accountId, zoneName).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#getRecord', function() {
    var accountId = '1010';
    var zoneName = 'example.com';
    var fixture = testUtils.fixture('getZoneRecord/success.http');

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/example.com/records/64784')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getRecord(accountId, 'example.com', 64784).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(64784);
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
        dnsimple.zones.getRecord(accountId, 'example.com', '0').then(function(response) {
          done('Error expected but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#createRecord', function() {
    var accountId = '1010';
    var zoneName = 'example.com';
    var attributes = {name: '', type: 'A', ttl: 3600, content: '1.2.3.4'};
    var fixture = testUtils.fixture('createZoneRecord/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/zones/' + zoneName + '/records', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createRecord(accountId, zoneName, attributes);

      endpoint.done();
      done();
    });

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/zones/' + zoneName + '/records', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createRecord(accountId, zoneName, attributes).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(64784);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#updateRecord', function() {
    var accountId = '1010';
    var zoneName = 'example.com';
    var recordId = 64784;
    var attributes = {content: '127.0.0.1'};
    var fixture = testUtils.fixture('updateZoneRecord/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .patch('/v2/1010/zones/' + zoneName + '/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.updateRecord(accountId, zoneName, recordId, attributes);

      endpoint.done();
      done();
    });

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/zones/' + zoneName + '/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.updateRecord(accountId, zoneName, recordId, attributes).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(64784);
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the record does not exist', function() {
      var fixture = testUtils.fixture('notfound-record.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/zones/' + zoneName + '/records/' + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.zones.updateRecord(accountId, zoneName, recordId, attributes).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#deleteRecord', function() {
    var accountId = '1010';
    var zoneName = 'example.com';
    var recordId = 64784;
    var fixture = testUtils.fixture('deleteZoneRecord/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .delete('/v2/1010/zones/' + zoneName + '/records/' + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteRecord(accountId, zoneName, recordId);

      endpoint.done();
      done();
    });

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/zones/' + zoneName + '/records/' + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteRecord(accountId, zoneName, recordId).then(function(response) {
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
          .delete('/v2/1010/zones/' + zoneName + '/records/' + recordId)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.zones.deleteRecord(accountId, zoneName, recordId).then(function(response) {
          done('Error expected but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });

  });
});
