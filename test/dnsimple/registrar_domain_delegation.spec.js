'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domain delegation', function() {
  let accountId = '1010';
  let domainId = 'example.com';

  describe('#getDomainDelegation', function() {
    var fixture = testUtils.fixture('getDomainDelegation/success.http');

    it('produces a name server list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/example.com/delegation')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getDomainDelegation(accountId, domainId).then(function(response) {
        var delegation = response.data
        expect(delegation).to.eql([
          'ns1.dnsimple.com',
          'ns2.dnsimple.com',
          'ns3.dnsimple.com',
          'ns4.dnsimple.com',
          ]);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#changeDomainDelegation', function() {
    var attributes = ['ns1.dnsimple.com','ns2.dnsimple.com','ns3.dnsimple.com','ns4.dnsimple.com'];

    it('produces a name server list', function(done) {
      var fixture = testUtils.fixture('changeDomainDelegation/success.http');
      nock('https://api.dnsimple.com')
        .put('/v2/1010/registrar/domains/example.com/delegation', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.changeDomainDelegation(accountId, domainId, attributes).then(function(response) {
        var delegation = response.data
        expect(delegation).to.eql([
          'ns1.dnsimple.com',
          'ns2.dnsimple.com',
          'ns3.dnsimple.com',
          'ns4.dnsimple.com',
          ]);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#changeDomainDelegationToVanity', function() {
    var attributes = ['ns1.example.com','ns2.example.com'];

    it('produces a name server list', function(done) {
      var fixture = testUtils.fixture('changeDomainDelegationToVanity/success.http');
      nock('https://api.dnsimple.com')
        .put('/v2/1010/registrar/domains/example.com/delegation/vanity', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.changeDomainDelegationToVanity(accountId, domainId, attributes).then(function(response) {
        var delegation = response.data
        expect(delegation.length).to.eq(2);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#changeDomainDelegationFromVanity', function() {
    it('produces nothing', function(done) {
      var fixture = testUtils.fixture('changeDomainDelegationFromVanity/success.http');
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/registrar/domains/example.com/delegation/vanity')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.changeDomainDelegationFromVanity(accountId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
