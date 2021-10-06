'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('domains', () => {
  describe('#enableDnssec', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const fixture = testUtils.fixture('enableDnssec/success.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/dnssec')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it('produces an response', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/dnssec')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDnssec(accountId, domainId).then((response) => {
        const dnssec = response.data;
        expect(dnssec.enabled).to.eq(true);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#disableDnssec', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const fixture = testUtils.fixture('disableDnssec/success.http');

    it('produces nothing', (done) => {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/dnssec')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.disableDnssec(accountId, domainId).then((response) => {
        expect(response).to.eql({});
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#getDnssec', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const fixture = testUtils.fixture('getDnssec/success.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/dnssec')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it('produces an response', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/dnssec')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDnssec(accountId, domainId).then((response) => {
        const dnssec = response.data;
        expect(dnssec.enabled).to.eq(true);
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
