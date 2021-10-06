'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

const querystring = require('querystring');

describe('oauth', () => {
  const clientId = 'super-client';
  const clientSecret = 'super-secret';
  const code = 'super-code';

  describe('#exchangeAuthorizationForToken', () => {
    const fixture = testUtils.fixture('oauthAccessToken/success.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/oauth/access_token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code'
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret);

      nock.isDone();
      done();
    });

    it('returns the oauth token', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/oauth/access_token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code'
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret).then((response) => {
        expect(response.access_token).to.eq('zKQ7OLqF5N1gylcJweA9WodA000BUNJD');
        expect(response.token_type).to.eq('Bearer');
        expect(response.account_id).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });

    describe('when state and redirect_uri are provided', () => {
      const state = 'super-state';
      const redirectUri = 'super-redirect-uri';

      it('builds the correct request', (done) => {
        nock('https://api.dnsimple.com')
          .post('/v2/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            state: state,
            redirect_uri: redirectUri
          })
          .reply(fixture.statusCode, fixture.body);

        const options = { state: state, redirectUri: redirectUri };
        dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret, options);

        nock.isDone();
        done();
      });
    });
  });

  describe('#authorizeUrl', () => {
    it('builds the correct url', () => {
      const authorizeUrl = new URL(dnsimple.oauth.authorizeUrl('great-app'));
      const expectedUrl = new URL('https://dnsimple.com/oauth/authorize?client_id=great-app&response_type=code');

      expect(authorizeUrl.protocol).to.eq(expectedUrl.protocol);
      expect(authorizeUrl.host).to.eq(expectedUrl.host);
      expect(querystring.parse(authorizeUrl.query)).to.deep.equal(querystring.parse(expectedUrl.query));
    });

    it('exposes the options in the query string', () => {
      let authorizeUrl = dnsimple.oauth.authorizeUrl('great-app', { secret: '1', redirect_uri: 'http://example.com' });
      authorizeUrl = new URL(authorizeUrl);

      let expectedUrl = 'https://dnsimple.com/oauth/authorize';
      expectedUrl += '?client_id=great-app&secret=1&redirect_uri=http://example.com&response_type=code';
      expectedUrl = new URL(expectedUrl);

      expect(authorizeUrl.protocol).to.eq(expectedUrl.protocol);
      expect(authorizeUrl.host).to.eq(expectedUrl.host);
      expect(querystring.parse(authorizeUrl.query)).to.deep.equal(querystring.parse(expectedUrl.query));
    });
  });
});
