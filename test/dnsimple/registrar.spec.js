'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('registrar', function () {
  const accountId = '1010';
  const domainId = 'example.com';

  describe('#checkDomain', function () {
    const domainId = 'ruby.codes';
    var fixture = testUtils.fixture('checkDomain/success.http');

    it('produces a check result', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/ruby.codes/check')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.checkDomain(accountId, domainId).then(function (response) {
        var checkResult = response.data;
        expect(checkResult.domain).to.eql('ruby.codes');
        expect(checkResult.available).to.eq(true);
        expect(checkResult.premium).to.eq(true);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#getDomainPremiumPrice', function () {
    describe('when the domain has a premium price', function () {
      const domainId = 'ruby.codes';
      var fixture = testUtils.fixture('getDomainPremiumPrice/success.http');

      it('produces a premium price result', function (done) {
        nock('https://api.dnsimple.com')
          .get('/v2/1010/registrar/domains/ruby.codes/premium_price')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(function (response) {
          var premiumPriceResult = response.data;
          expect(premiumPriceResult.premium_price).to.eql('109.00');
          expect(premiumPriceResult.action).to.eql('registration');
          done();
        }, function (error) {
          done(error);
        });
      });
    });

    describe('when the domain is not a premium domain', function () {
      const domainId = 'example.com';
      var fixture = testUtils.fixture('getDomainPremiumPrice/failure.http');

      it('produces an error', function (done) {
        nock('https://api.dnsimple.com')
          .get('/v2/1010/registrar/domains/example.com/premium_price')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Bad request');
          expect(error.message).to.eq('`example.com` is not a premium domain for registration');
          done();
        });
      });
    });
  });

  describe('#registerDomain', function () {
    var fixture = testUtils.fixture('registerDomain/success.http');

    it('produces a domain', function (done) {
      var attributes = { registrant_id: '10' };

      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/registrations', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.registerDomain(accountId, domainId, attributes).then(function (response) {
        var domainRegistration = response.data;
        expect(domainRegistration.id).to.eq(1);
        expect(domainRegistration.state).to.eq('new');
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#renewDomain', function () {
    var fixture = testUtils.fixture('renewDomain/success.http');

    it('produces a domain', function (done) {
      var attributes = { period: '3' };

      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/renewals', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.renewDomain(accountId, domainId, attributes).then(function (response) {
        var domainRenewal = response.data;
        expect(domainRenewal.id).to.eq(1);
        expect(domainRenewal.state).to.eq('new');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when it is too soon for the domain to be renewed', function () {
      var fixture = testUtils.fixture('renewDomain/error-tooearly.http');

      it('results in an error', function (done) {
        var attributes = {};

        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/renewals', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.renewDomain(accountId, domainId, attributes).then(function (response) {
          done('Expected error, but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#transferDomain', function () {
    var attributes = { registrant_id: '10', auth_code: 'x1y2z3' };

    it('produces a domain', function (done) {
      var fixture = testUtils.fixture('transferDomain/success.http');
      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/transfers', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function (response) {
        var domain = response.data;
        expect(domain.id).to.eq(1);
        expect(domain.state).to.eq('transferring');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the domain is already in DNSimple', function () {
      var fixture = testUtils.fixture('transferDomain/error-indnsimple.http');

      it('results in an error', function (done) {
        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/transfers', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function (response) {
          done('Expected error, but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });

    describe('when authcode was not provided and is required by the TLD', function () {
      var fixture = testUtils.fixture('transferDomain/error-missing-authcode.http');

      it('results in an error', function (done) {
        var attributes = { registrant_id: '10' };

        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/transfers', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function (response) {
          done('Expected error, but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#getDomainTransfer', function () {
    var fixture = testUtils.fixture('getDomainTransfer/success.http');

    it('retrieves a domain transfer', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/example.com/transfers/42')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getDomainTransfer(accountId, domainId, 42).then(function (response) {
        var domainTransfer = response.data;
        expect(domainTransfer.id).to.eq(361);
        expect(domainTransfer.domain_id).to.eq(182245);
        expect(domainTransfer.registrant_id).to.eq(2715);
        expect(domainTransfer.state).to.eq('cancelled');
        expect(domainTransfer.auto_renew).to.eq(false);
        expect(domainTransfer.whois_privacy).to.eq(false);
        expect(domainTransfer.status_description).to.eq('Canceled by customer');
        expect(domainTransfer.created_at).to.eq('2020-06-05T18:08:00Z');
        expect(domainTransfer.updated_at).to.eq('2020-06-05T18:10:01Z');
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#cancelDomainTransfer', function () {
    var fixture = testUtils.fixture('cancelDomainTransfer/success.http');

    it('cancels a domain transfer', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/registrar/domains/example.com/transfers/42')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.cancelDomainTransfer(accountId, domainId, 42).then(function (response) {
        var domainTransfer = response.data;
        expect(domainTransfer.id).to.eq(361);
        expect(domainTransfer.domain_id).to.eq(182245);
        expect(domainTransfer.registrant_id).to.eq(2715);
        expect(domainTransfer.state).to.eq('transferring');
        expect(domainTransfer.auto_renew).to.eq(false);
        expect(domainTransfer.whois_privacy).to.eq(false);
        expect(domainTransfer.status_description).to.eq(null);
        expect(domainTransfer.created_at).to.eq('2020-06-05T18:08:00Z');
        expect(domainTransfer.updated_at).to.eq('2020-06-05T18:08:04Z');
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#transferDomainOut', function () {
    var fixture = testUtils.fixture('authorizeDomainTransferOut/success.http');

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/authorize_transfer_out')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.transferDomainOut(accountId, domainId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });
});
