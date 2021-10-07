'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('whois privacy', () => {
  const accountId = '1010';
  const domainId = 'example.com';

  describe('#getWhoisPrivacy', () => {
    const fixture = testUtils.fixture('getWhoisPrivacy/success.http');

    it('produces a whois privacy', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/example.com/whois_privacy')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getWhoisPrivacy(accountId, domainId).then((response) => {
        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).to.eq(1);
        expect(whoisPrivacy.domain_id).to.eq(2);
        expect(whoisPrivacy.expires_on).to.eq('2017-02-13');
        expect(whoisPrivacy.enabled).to.eq(true);
        expect(whoisPrivacy.created_at).to.eq('2016-02-13T14:34:50Z');
        expect(whoisPrivacy.updated_at).to.eq('2016-02-13T14:34:52Z');
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#enableWhoisPrivacy', () => {
    describe('when whois privacy is already purchased', () => {
      const fixture = testUtils.fixture('enableWhoisPrivacy/success.http');

      it('produces a whois privacy', (done) => {
        nock('https://api.dnsimple.com')
          .put('/v2/1010/registrar/domains/example.com/whois_privacy')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableWhoisPrivacy(accountId, domainId).then((response) => {
          const whoisPrivacy = response.data;
          expect(whoisPrivacy.id).to.eq(1);
          expect(whoisPrivacy.domain_id).to.eq(2);
          done();
        }, (error) => {
          done(error);
        });
      });
    });

    describe('when whois privacy is newly purchased', () => {
      const fixture = testUtils.fixture('enableWhoisPrivacy/created.http');

      it('produces a whois privacy', (done) => {
        nock('https://api.dnsimple.com')
          .put('/v2/1010/registrar/domains/example.com/whois_privacy')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableWhoisPrivacy(accountId, domainId).then((response) => {
          const whoisPrivacy = response.data;
          expect(whoisPrivacy.id).to.eq(1);
          expect(whoisPrivacy.domain_id).to.eq(2);
          done();
        }, (error) => {
          done(error);
        });
      });
    });
  });

  describe('#disableWhoisPrivacy', () => {
    const fixture = testUtils.fixture('disableWhoisPrivacy/success.http');

    it('produces a whois privacy', (done) => {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/registrar/domains/example.com/whois_privacy')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableWhoisPrivacy(accountId, domainId).then((response) => {
        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).to.eq(1);
        expect(whoisPrivacy.domain_id).to.eq(2);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#renewWhoisPrivacy', () => {
    const fixture = testUtils.fixture('renewWhoisPrivacy/success.http');

    it('produces a whois privacy renewal', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/registrar/domains/example.com/whois_privacy/renewals')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.renewWhoisPrivacy(accountId, domainId).then((response) => {
        const whoisPrivacyRenewal = response.data;
        expect(whoisPrivacyRenewal.id).to.eq(1);
        expect(whoisPrivacyRenewal.domain_id).to.eq(100);
        expect(whoisPrivacyRenewal.whois_privacy_id).to.eq(999);
        expect(whoisPrivacyRenewal.state).to.eq('new');
        expect(whoisPrivacyRenewal.enabled).to.eq(true);
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
