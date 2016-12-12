'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('registrar', function() {
  let accountId = '1010';
  let domainId = 'example.com';

  describe('#checkDomain', function() {
    let domainId = 'ruby.codes';
    var fixture = testUtils.fixture('checkDomain/success.http');

    it('produces a check result', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/ruby.codes/check')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.checkDomain(accountId, domainId).then(function(response) {
        var checkResult = response.data;
        expect(checkResult.domain).to.eql('ruby.codes');
        expect(checkResult.available).to.be.true;
        expect(checkResult.premium).to.be.true;
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#getDomainPremiumPrice', function() {
    describe('when the domain has a premium price', function() {
      let domainId = 'ruby.codes';
      var fixture = testUtils.fixture('getDomainPremiumPrice/success.http');

      it('produces a premium price result', function(done) {
        nock('https://api.dnsimple.com')
          .get('/v2/1010/registrar/domains/ruby.codes/premium_price')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(function(response) {
          var premiumPriceResult = response.data;
          expect(premiumPriceResult.premium_price).to.eql('109.00');
          expect(premiumPriceResult.action).to.eql('registration');
          done();
        }, function(error) {
          done(error);
        });
      });
    });

    describe('when the domain is not a premium domain', function() {
      let domainId = 'example.com';
      var fixture = testUtils.fixture('getDomainPremiumPrice/failure.http');

      it('produces an error', function(done) {
        nock('https://api.dnsimple.com')
          .get('/v2/1010/registrar/domains/example.com/premium_price')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          expect(error.description).to.eq('Bad request');
          expect(error.message).to.eq('`example.com` is not a premium domain for registration');
          done();
        });
      });
    });
  });

  describe('#registerDomain', function() {
    var fixture = testUtils.fixture('registerDomain/success.http');

    it('produces a domain', function(done) {
      var attributes = {registrant_id: '10'};

      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/registration', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.registerDomain(accountId, domainId, attributes).then(function(response) {
        var domainRegistration = response.data;
        expect(domainRegistration.id).to.eq(1);
        expect(domainRegistration.state).to.eq('new');
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#renewDomain', function() {
    var fixture = testUtils.fixture('renewDomain/success.http');

    it('produces a domain', function(done) {
      var attributes = {period: '3'};

      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/renewal', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.renewDomain(accountId, domainId, attributes).then(function(response) {
        var domainRenewal = response.data;
        expect(domainRenewal.id).to.eq(1);
        expect(domainRenewal.state).to.eq('new');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when it is too soon for the domain to be renewed', function() {
      var fixture = testUtils.fixture('renewDomain/error-tooearly.http');

      it('results in an error', function(done) {
        var attributes = {};

        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/renewal', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.renewDomain(accountId, domainId, attributes).then(function(response) {
          done('Expected error, but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#transferDomain', function() {
    var attributes = {registrant_id: '10', auth_code: 'x1y2z3'};

    it('produces a domain', function(done) {
      var fixture = testUtils.fixture('transferDomain/success.http');
      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/transfer', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function(response) {
        var domain = response.data;
        expect(domain.id).to.eq(1);
        expect(domain.state).to.eq('transferring');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the domain is already in DNSimple', function() {
      var fixture = testUtils.fixture('transferDomain/error-indnsimple.http');

      it('results in an error', function(done) {
        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/transfer', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function(response) {
          done('Expected error, but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });

    describe('when authcode was not provided and is required by the TLD', function() {
      var fixture = testUtils.fixture('transferDomain/error-missing-authcode.http');

      it('results in an error', function(done) {
        var attributes = {registrant_id: '10'};

        nock('https://api.dnsimple.com')
          .post('/v2/1010/registrar/domains/example.com/transfer', attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(function(response) {
          done('Expected error, but future resolved');
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#transferDomainOut', function() {
    var fixture = testUtils.fixture('transferDomainOut/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/transfer_out')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.transferDomainOut(accountId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
