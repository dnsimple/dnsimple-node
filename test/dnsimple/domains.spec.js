'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

var expect = require('chai').expect;
var nock = require('nock');
var fixture = testUtils.fixture('listDomains/success.http');
var endpoint = nock('https://api.dnsimple.com')
                 .get('/v2/1010/domains')
                 .reply(fixture.statusCode, fixture.body);

describe('domains', function() {
  describe('#listDomains', function() {
    it('produces a domain list', function(done) {
      var accountId = '1010'
      dnsimple.domains.listDomains(accountId, function(error, response) {
        expect(error).to.be.null;
        expect(response.data.length).to.eq(2);
        done();
      });
    });
  });
});
