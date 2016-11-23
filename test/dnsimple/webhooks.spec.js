'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('webhooks', function() {
  describe('#listWebhooks', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listDomains/success.http');

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.listWebhooks(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('produces a webhook list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.listWebhooks(accountId).then(function(response) {
        var webhooks = response.data;
        expect(webhooks.length).to.eq(2);
        expect(webhooks[0].id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allWebhooks', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listDomains/success.http');

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.allWebhooks(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('produces a webhook list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.allWebhooks(accountId).then(function(items) {
        expect(items.length).to.eq(2);
        expect(items[0].id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#getWebhook', function() {
    var accountId = '1010';
    var webhookId = '1';
    var fixture = testUtils.fixture('getWebhook/success.http');

    it('produces a webhook', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.getWebhook(accountId, webhookId).then(function(response) {
        var webhook = response.data;
        expect(webhook.id).to.eq(1);
        expect(webhook.url).to.eq('https://webhook.test');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the webhook does not exist', function() {
      var fixture = testUtils.fixture('notfound-webhook.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.webhooks.getWebhook(accountId, 0).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Webhook `0` not found');
          done();
        });
      });
    });
  });

  describe('#createWebhook', function() {
    var accountId = '1010';
    var attributes = {url: 'https://some-site.com'};
    var fixture = testUtils.fixture('createWebhook/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/webhooks', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.createWebhook(accountId, attributes);

      endpoint.done();
      done();
    });

    it('produces a webhook', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/webhooks')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.createWebhook(accountId, attributes).then(function(response) {
        var webhook = response.data;
        expect(webhook.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#deleteWebhook', function() {
    var accountId = '1010';
    var webhookId = 1;

    it('produces nothing', function(done) {
      var fixture = testUtils.fixture('deleteWebhook/success.http');
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/webhooks/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.webhooks.deleteWebhook(accountId, webhookId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the webhook does not exist', function() {
      var fixture = testUtils.fixture('notfound-webhook.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/webhooks/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function(done) {
        dnsimple.webhooks.deleteWebhook(accountId, 0).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });
});
