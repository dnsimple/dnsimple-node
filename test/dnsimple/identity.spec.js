'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});
const expect = require('chai').expect;
const nock = require('nock');

describe('identity', () => {
  describe('#whoami when authenticated as account', () => {
    const fixture = testUtils.fixture('whoami/success-account.http');
    nock('https://api.dnsimple.com')
      .get('/v2/whoami')
      .reply(fixture.statusCode, fixture.body);

    it('produces an account', (done) => {
      dnsimple.identity.whoami().then((response) => {
        expect(response.data.user).to.eq(null);
        const account = response.data.account;
        expect(account.id).to.eql(1);
        expect(account.email).to.eql('example-account@example.com');
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#whoami when authenticated as user', () => {
    const fixture = testUtils.fixture('whoami/success-user.http');
    nock('https://api.dnsimple.com')
      .get('/v2/whoami')
      .reply(fixture.statusCode, fixture.body);

    it('produces a user', (done) => {
      dnsimple.identity.whoami().then((response) => {
        expect(response.data.account).to.eq(null);
        const user = response.data.user;
        expect(user.id).to.eql(1);
        expect(user.email).to.eql('example-user@example.com');
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
