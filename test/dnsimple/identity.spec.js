'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')(
  testUtils.getAccessToken()
);

var expect = require('chai').expect;

describe('identity', function() {
  describe('#whoami', function() {
    it('returns an account', function() {
      var account = dnsimple.identity.whoami();
      expect(account).to.eql({});
    });
  });
});
