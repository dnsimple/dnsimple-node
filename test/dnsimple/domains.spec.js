'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')(
  testUtils.getAccessToken()
);

var expect = require('chai').expect;

describe('domains', function() {
  describe('#listDomains', function() {
    it('returns a domain list', function() {
      var accountId = '1010'
      var domains = dnsimple.domains.listDomains(accountId);
      expect(domains).to.eql([]);
    });
  });
});
