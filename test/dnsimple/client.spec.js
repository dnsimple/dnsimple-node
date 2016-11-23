'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const Client = require('../../lib/dnsimple/client');

const expect = require('chai').expect;
const nock = require('nock');

describe('response handling', function() {
  describe('a 400 error', function() {
    it('includes the error message from the server', function(done) {
      let fixture = testUtils.fixture('validation-error.http');
      nock('https://api.dnsimple.com')
        .post('/v2/validation-error', {})
        .reply(fixture.statusCode, fixture.body);

      new Client(dnsimple).post('/validation-error', {}, {}).then(function(response) {
        done('Expected error but promise resolved');
      }, function(error) {
        expect(error.message).to.eq('Validation failed');
        expect(error.errors.email).to.include('can\'t be blank');
        done();
      });
    });
  });

  describe('a 200 response with malformed json', function() {
    it('produces a JSON parse error', function(done) {
      let fixture = testUtils.fixture('success-with-malformed-json.http');
      nock('https://api.dnsimple.com')
        .get('/v2/success-with-malformed-json')
        .reply(fixture.statusCode, fixture.body);

      new Client(dnsimple).get('/success-with-malformed-json', {}).then(function(response) {

        done('Expected error but promise resolved');
      }, function(error) {
        expect(error).to.eq('Unexpected token < in JSON at position 0');
        done();
      });
    });
  });

  describe('an error response with HTML content', function() {
    it('produces a JSON parse error', function(done) {
      let fixture = testUtils.fixture('badgateway.http');
      nock('https://api.dnsimple.com')
        .get('/v2/badgateway')
        .reply(fixture.statusCode, fixture.body);

      new Client(dnsimple).get('/badgateway', {}).then(function(response) {
        done('Expected error but promise resolved');
      }, function(error) {
        expect(error).to.eq('Unexpected token < in JSON at position 0');
        done();
      });
    });
  });

  describe('a 405 error', function() {
    it('results in a rejected promise', function(done) {
      let fixture = testUtils.fixture('method-not-allowed.http');
      nock('https://api.dnsimple.com')
        .get('/v2/method-not-allowed')
        .reply(fixture.statusCode, fixture.body);

      new Client(dnsimple).get('/method-not-allowed', {}).then(function(response) {
        done('Expected error but promise resolved');
      }, function(error) {
        expect(error.description).to.eq('Method not allowed');
        done();
      });
    });
  });
});
