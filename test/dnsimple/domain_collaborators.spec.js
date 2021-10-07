'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('collaborators', () => {
  describe('#listCollaborators', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const fixture = testUtils.fixture('listCollaborators/success.http');

    it('supports pagination', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listCollaborators(accountId, domainId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listCollaborators(accountId, domainId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('produces a collaborators list', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listCollaborators(accountId, domainId).then((response) => {
        const collaborators = response.data;
        expect(collaborators.length).to.eq(2);
        expect(collaborators[0].id).to.eq(100);
        expect(collaborators[0].domain_id).to.eq(1);
        expect(collaborators[0].user_id).to.eq(999);
        done();
      }, (error) => {
        done(error);
      });
    });

    it('exposes the pagination info', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listCollaborators(accountId, domainId).then((response) => {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#addCollaborator', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const collaborator = {
      email: 'existing-user@example.com'
    };

    it('produces a response', (done) => {
      const fixture = testUtils.fixture('addCollaborator/success.http');

      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/collaborators')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.addCollaborator(accountId, domainId, collaborator).then((response) => {
        const data = response.data;
        expect(data.id).to.eql(100);
        expect(data.invitation).to.eql(false);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#removeCollaborator', () => {
    const accountId = '1010';
    const domainId = 'example.com';
    const collaboratorId = '100';

    it('produces nothing', (done) => {
      const fixture = testUtils.fixture('removeCollaborator/success.http');

      nock('https://api.dnsimple.com')
        .delete('/v2/1010/domains/example.com/collaborators/100')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.removeCollaborator(accountId, domainId, collaboratorId).then((response) => {
        expect(response).to.eql({});
        done();
      }, (error) => {
        done(error);
      });
    });
  });
});
