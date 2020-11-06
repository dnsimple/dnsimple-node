'use strict';

const testUtils = require('./testUtils');
const dnsimple = require('../lib/dnsimple')(
  testUtils.getAccessToken()
);

const expect = require('chai').expect;

describe('dnsimple module', function () {
  describe('#setAccessToken', function () {
    it('sets the access token', function () {
      dnsimple.setAccessToken('abc123');
      expect(dnsimple._api.accessToken).to.equal('abc123');
    });
  });

  describe('#setUserAgent', function () {
    it('respects the default User-Agent', function () {
      expect(dnsimple._api.userAgent).to.equal('dnsimple-node/' + dnsimple.VERSION);
    });

    it('composes the User-Agent', function () {
      dnsimple.setUserAgent('my-app');
      expect(dnsimple._api.userAgent).to.equal('my-app dnsimple-node/' + dnsimple.VERSION);
    });
  });
});
