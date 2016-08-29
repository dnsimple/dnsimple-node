'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('registrar', function() {
  let accountId = '1010';
  let domainId = 'example.com';

  describe('#checkDomain', function() {
    var fixture = testUtils.fixture('checkDomain/success.http');

    it('produces a check result', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/registrar/domains/example.com/check')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.checkDomain(accountId, domainId).then(function(response) {
        var checkResult = response.data;
        expect(checkResult.domain).to.eql('example.com');
        expect(checkResult.available).to.be.true;
        expect(checkResult.premium).to.be.false;
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
