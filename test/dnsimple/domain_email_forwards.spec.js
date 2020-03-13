'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domains', function () {
  describe('#listEmailForwards', function () {
    var accountId = '1010';
    var domainId = 'example.com';
    var fixture = testUtils.fixture('listEmailForwards/success.http');

    it('supports pagination', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?sort=from%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, { sort: 'from:asc' });

      nock.isDone();
      done();
    });

    it('produces an email forward list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId).then(function (response) {
        var emailForwards = response.data;
        expect(emailForwards.length).to.eq(2);
        done();
      }, function (error) {
        done(error);
      });
    });

    it('exposes the pagination info', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId).then(function (response) {
        var pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allEmailForwards', function () {
    var accountId = '1010';
    var domainId = 'example.com';

    it('produces a complete list', function (done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.domains.allEmailForwards(accountId, domainId).then(function (items) {
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

  describe('#getEmailForward', function () {
    var accountId = '1010';
    var domainId = 'example.com';
    var emailForwardId = 1;
    var fixture = testUtils.fixture('getEmailForward/success.http');

    it('produces an email forward', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getEmailForward(accountId, domainId, emailForwardId).then(function (response) {
        var emailForward = response.data;
        expect(emailForward.id).to.eq(17706);
        expect(emailForward.domain_id).to.eq(228963);
        expect(emailForward.from).to.eq('jim@a-domain.com');
        expect(emailForward.to).to.eq('jim@another.com');
        expect(emailForward.created_at).to.eq('2016-02-04T14:26:50Z');
        expect(emailForward.updated_at).to.eq('2016-02-04T14:26:50Z');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the email forward does not exist', function () {
      var fixture = testUtils.fixture('notfound-emailforward.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/email_forwards/0')
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.domains.getEmailForward(accountId, domainId, 0).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Email forward `0` not found');
          done();
        });
      });
    });
  });

  describe('#createEmailForward', function () {
    var accountId = '1010';
    var domainId = 'example.com';
    var attributes = { from: 'jim' };
    var fixture = testUtils.fixture('createEmailForward/created.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/email_forwards', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      nock.isDone();
      done();
    });

    it('produces an email forward', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/email_forwards')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createEmailForward(accountId, domainId, attributes).then(function (response) {
        var emailForward = response.data;
        expect(emailForward.id).to.eq(17706);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#deleteEmailForward', function () {
    var accountId = '1010';
    var domainId = 'example.com';
    var emailForwardId = 1;
    var fixture = testUtils.fixture('deleteEmailForward/success.http');

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/email_forwards/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.deleteEmailForward(accountId, domainId, emailForwardId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });
});
