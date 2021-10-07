'use strict';

const testUtils = require('./testUtils');
const dnsimple = require('../lib/dnsimple')(
  testUtils.getAccessToken()
);

const expect = require('chai').expect;

describe('dnsimple module', () => {
  describe('#setAccessToken', () => {
    it('sets the access token', () => {
      dnsimple.setAccessToken('abc123');
      expect(dnsimple._api.accessToken).to.equal('abc123');
    });
  });

  describe('#setUserAgent', () => {
    it('respects the default User-Agent', () => {
      expect(dnsimple._api.userAgent).to.equal('dnsimple-node/' + dnsimple.VERSION);
    });

    it('composes the User-Agent', () => {
      dnsimple.setUserAgent('my-app');
      expect(dnsimple._api.userAgent).to.equal('my-app dnsimple-node/' + dnsimple.VERSION);
    });
  });
});
