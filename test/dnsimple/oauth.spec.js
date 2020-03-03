'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

const url = require('url');
const querystring = require('querystring');

describe('oauth', function() {
  var clientId = 'super-client';
  var clientSecret = 'super-secret';
  var code = 'super-code';

  describe('#exchangeAuthorizationForToken', function() {
    var fixture = testUtils.fixture('oauthAccessToken/success.http');

    it('builds the correct request', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/oauth/access_token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret);

      nock.isDone();
      done();
    });

    it('returns the oauth token', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/oauth/access_token', {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          grant_type: 'authorization_code',
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret).then(function(response) {
        expect(response.access_token).to.eq('zKQ7OLqF5N1gylcJweA9WodA000BUNJD');
        expect(response.token_type).to.eq('Bearer');
        expect(response.account_id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when state and redirect_uri are provided', function() {
      var state = 'super-state';
      var redirectUri = 'super-redirect-uri';

      it('builds the correct request', function(done) {
        nock('https://api.dnsimple.com')
          .post('/v2/oauth/access_token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code',
            state: state,
            redirect_uri: redirectUri,
          })
          .reply(fixture.statusCode, fixture.body);

        let options = {state: state, redirectUri: redirectUri};
        dnsimple.oauth.exchangeAuthorizationForToken(code, clientId, clientSecret, options);

        nock.isDone();
        done();
      });
    });
  });

  describe('#authorizeUrl', function() {
    it('builds the correct url', function() {
      let authorizeUrl = url.parse(dnsimple.oauth.authorizeUrl('great-app'));
      let expectedUrl = url.parse('https://dnsimple.com/oauth/authorize?client_id=great-app&response_type=code');

      expect(authorizeUrl.protocol).to.eq(expectedUrl.protocol);
      expect(authorizeUrl.host).to.eq(expectedUrl.host);
      expect(querystring.parse(authorizeUrl.query)).to.deep.equal(querystring.parse(expectedUrl.query));
    });

    it('exposes the options in the query string', function() {
      var authorizeUrl = dnsimple.oauth.authorizeUrl('great-app', {secret: '1', redirect_uri: 'http://example.com'});
      authorizeUrl = url.parse(authorizeUrl);

      var expectedUrl = 'https://dnsimple.com/oauth/authorize';
      expectedUrl += '?client_id=great-app&secret=1&redirect_uri=http://example.com&response_type=code'
      expectedUrl = url.parse(expectedUrl);

      expect(authorizeUrl.protocol).to.eq(expectedUrl.protocol);
      expect(authorizeUrl.host).to.eq(expectedUrl.host);
      expect(querystring.parse(authorizeUrl.query)).to.deep.equal(querystring.parse(expectedUrl.query));
    });
  });

});
