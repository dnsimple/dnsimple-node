'use strict';

var testUtils = require('./testUtils');
var dnsimple = require('../lib/dnsimple')(
  testUtils.getAccessToken()
);

var expect = require('chai').expect;

describe('dnsimple module', function() {

  describe('setAccessToken', function() {
    it('sets the access token', function() {
      dnsimple.setAccessToken('abc123');
      expect(dnsimple._api.accessToken).to.equal('abc123');
    });
  });
});
