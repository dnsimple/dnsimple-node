'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('collaborators', function() {
  describe('#listCollaborators', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var fixture = testUtils.fixture('listCollaborators/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.listCollaborators(accountId, domainId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.listCollaborators(accountId, domainId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('produces a collaborators list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.listCollaborators(accountId, domainId).then(function(response) {
        var collaborators = response.data;
        expect(collaborators.length).to.eq(2);
        expect(collaborators[0].id).to.eq(100);
        expect(collaborators[0].domain_id).to.eq(1);
        expect(collaborators[0].user_id).to.eq(999);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.listCollaborators(accountId, domainId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#addCollaborator', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var collaborator = {
      email: 'existing-user@example.com',
    };

    it('produces a response', function(done) {
      var fixture = testUtils.fixture('addCollaborator/success.http');

      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.addCollaborator(accountId, domainId, collaborator).then(function(response) {
        var data = response.data;
        expect(data.id).to.eql(100);
        expect(data.invitation).to.eql(false);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#removeCollaborator', function() {
    var accountId = '1010';
    var domainId = 'example.com';
    var collaboratorId = '100';

    it('produces nothing', function(done) {
      var fixture = testUtils.fixture('removeCollaborator/success.http');

      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/collaborators/100')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.collaborators.removeCollaborator(accountId, domainId, collaboratorId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
