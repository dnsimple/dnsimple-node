'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('vanity name servers', function() {
  let accountId = '1010';
  let domainId = 'example.com';

  describe('#enableVanityNameServers', function() {
    var fixture = testUtils.fixture('enableVanityNameServers/success.http');

    it('produces a list of name servers', function(done) {
      nock('https://api.dnsimple.com')
        .put('/v2/1010/vanity/example.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.vanityNameServers.enableVanityNameServers(accountId, domainId).then(function(response) {
        var vanityNameServers = response.data;
        expect(vanityNameServers.length).to.eq(4);
        expect(vanityNameServers[0].id).to.eq(1);
        expect(vanityNameServers[0].ipv4).to.eq('127.0.0.1');
        expect(vanityNameServers[0].ipv6).to.eq('::1');
        expect(vanityNameServers[0].created_at).to.eq('2016-07-14T13:22:17Z');
        expect(vanityNameServers[0].updated_at).to.eq('2016-07-14T13:22:17Z');
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#disableVanityNameServers', function() {
    var fixture = testUtils.fixture('disableVanityNameServers/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/vanity/example.com')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.vanityNameServers.disableVanityNameServers(accountId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
