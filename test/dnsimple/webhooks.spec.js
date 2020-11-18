'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('webhooks', function () {
  describe('#listWebhooks', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('listWebhooks/success.http');

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.listWebhooks(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('produces a webhook list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.listWebhooks(accountId).then(function (response) {
        const webhooks = response.data;
        expect(webhooks.length).to.eq(2);
        expect(webhooks[0].id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allWebhooks', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('listWebhooks/success.http');

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.allWebhooks(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('produces a webhook list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.allWebhooks(accountId).then(function (items) {
        expect(items.length).to.eq(2);
        expect(items[0].id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#getWebhook', function () {
    const accountId = '1010';
    const webhookId = '1';
    const fixture = testUtils.fixture('getWebhook/success.http');

    it('produces a webhook', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.getWebhook(accountId, webhookId).then(function (response) {
        const webhook = response.data;
        expect(webhook.id).to.eq(1);
        expect(webhook.url).to.eq('https://webhook.test');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the webhook does not exist', function () {
      const fixture = testUtils.fixture('notfound-webhook.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.webhooks.getWebhook(accountId, 0).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Webhook `0` not found');
          done();
        });
      });
    });
  });

  describe('#createWebhook', function () {
    const accountId = '1010';
    const attributes = { url: 'https://some-site.com' };
    const fixture = testUtils.fixture('createWebhook/created.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/webhooks', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.createWebhook(accountId, attributes);

      nock.isDone();
      done();
    });

    it('produces a webhook', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.createWebhook(accountId, attributes).then(function (response) {
        const webhook = response.data;
        expect(webhook.id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#deleteWebhook', function () {
    const accountId = '1010';
    const webhookId = 1;

    it('produces nothing', function (done) {
      const fixture = testUtils.fixture('deleteWebhook/success.http');
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/webhooks/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.deleteWebhook(accountId, webhookId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the webhook does not exist', function () {
      const fixture = testUtils.fixture('notfound-webhook.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.webhooks.deleteWebhook(accountId, 0).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });
});
