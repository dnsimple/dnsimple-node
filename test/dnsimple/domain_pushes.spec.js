'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domains', function() {
  describe('#initiatePush', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var attributes = {new_account_email: 'jim@example.com'};
    var fixture = testUtils.fixture('initiatePush/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/pushes', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes);

      endpoint.done();
      done();
    });

    it('produces a push result', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/pushes')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes).then(function(response) {
        var push = response.data;
        expect(push.id).to.eq(1);
        expect(push.domain_id).to.eq(100);
        expect(push.contact_id).to.be.null;
        expect(push.account_id).to.eq(2020);
        expect(push.created_at).to.eq('2016-08-11T10:16:03.340Z');
        expect(push.updated_at).to.eq('2016-08-11T10:16:03.340Z');
        expect(push.accepted_at).to.be.null;
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#listPushes', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listPushes/success.http');

    it('produces an pushes list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/pushes')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listPushes(accountId).then(function(response) {
        var pushes = response.data;
        expect(pushes.length).to.eq(2);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#acceptPush', function() {
    var accountId = '1010';
    var pushId = '200';
    var attributes = {contact_id: 1};
    var fixture = testUtils.fixture('acceptPush/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/pushes/200', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes);

      endpoint.done();
      done();
    });

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#rejectPush', function() {
    var accountId = '1010';
    var pushId = '200';
    var fixture = testUtils.fixture('rejectPush/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .delete('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId);

      endpoint.done();
      done();
    });

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
