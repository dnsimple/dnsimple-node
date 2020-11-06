'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domains', function () {
  describe('#initiatePush', function () {
    const accountId = '1010';
    const domainId = 'example.com';
    const attributes = { new_account_email: 'jim@example.com' };
    const fixture = testUtils.fixture('initiatePush/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/pushes', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes);

      nock.isDone();
      done();
    });

    it('produces a push result', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/pushes')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes).then(function (response) {
        const push = response.data;
        expect(push.id).to.eq(1);
        expect(push.domain_id).to.eq(100);
        expect(push.contact_id).to.eq(null);
        expect(push.account_id).to.eq(2020);
        expect(push.created_at).to.eq('2016-08-11T10:16:03Z');
        expect(push.updated_at).to.eq('2016-08-11T10:16:03Z');
        expect(push.accepted_at).to.eq(null);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#listPushes', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('listPushes/success.http');

    it('produces an pushes list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/pushes')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listPushes(accountId).then(function (response) {
        const pushes = response.data;
        expect(pushes.length).to.eq(2);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#acceptPush', function () {
    const accountId = '1010';
    const pushId = '200';
    const attributes = { contact_id: 1 };
    const fixture = testUtils.fixture('acceptPush/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/pushes/200', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes);

      nock.isDone();
      done();
    });

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#rejectPush', function () {
    const accountId = '1010';
    const pushId = '200';
    const fixture = testUtils.fixture('rejectPush/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId);

      nock.isDone();
      done();
    });

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/pushes/200')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });
});
