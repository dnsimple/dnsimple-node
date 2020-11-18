'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('templates', function () {
  describe('#listTemplates', function () {
    const accountId = '1010';
    const fixture = testUtils.fixture('listTemplates/success.http');

    it('supports pagination', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { sort: 'name:asc' });

      nock.isDone();
      done();
    });

    it('produces a template list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function (response) {
        const templates = response.data;
        expect(templates.length).to.eq(2);
        expect(templates[0].name).to.eq('Alpha');
        expect(templates[0].account_id).to.eq(1010);
        done();
      }, function (error) {
        done(error);
      });
    });

    it('exposes the pagination info', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function (response) {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allTemplates', function () {
    const accountId = '1010';

    it('produces a complete list', function (done) {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.allTemplates(accountId).then(function (items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function (error) {
        done(error);
      }).catch(function (error) {
        done(error);
      });
    });
  });

  describe('#getTemplate', function () {
    const accountId = '1010';
    const templateId = 'name';

    it('produces a template', function (done) {
      const fixture = testUtils.fixture('getTemplate/success.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getTemplate(accountId, templateId).then(function (response) {
        const template = response.data;
        expect(template.id).to.eq(1);
        expect(template.account_id).to.eq(1010);
        expect(template.name).to.eq('Alpha');
        expect(template.sid).to.eq('alpha');
        expect(template.description).to.eq('An alpha template.');
        expect(template.created_at).to.eq('2016-03-22T11:08:58Z');
        expect(template.updated_at).to.eq('2016-03-22T11:08:58Z');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the template does not exist', function () {
      it('produces an error', function (done) {
        const fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/name')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplate(accountId, templateId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Template `beta` not found');
          done();
        });
      });
    });
  });

  describe('#createTemplate', function () {
    const accountId = '1010';
    const attributes = { name: 'Beta' };
    const fixture = testUtils.fixture('createTemplate/created.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates', { name: 'Beta' })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes);

      nock.isDone();
      done();
    });

    it('produces a template', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes).then(function (response) {
        const template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#updateTemplate', function () {
    const accountId = '1010';
    const templateId = 1;
    const attributes = { name: 'Alpha' };
    const fixture = testUtils.fixture('updateTemplate/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1', { name: 'Alpha' })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes);

      nock.isDone();
      done();
    });

    it('produces a template', function (done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function (response) {
        const template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the template does not exist', function () {
      it('produces an error', function (done) {
        const fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .patch('/v2/1010/templates/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#deleteTemplate', function () {
    const accountId = '1010';
    const templateId = 1;
    const fixture = testUtils.fixture('deleteTemplate/success.http');

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteTemplate(accountId, templateId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#applyTemplate', function () {
    const accountId = '1010';
    const domainId = 'example.com';
    const templateId = 1;
    const fixture = testUtils.fixture('applyTemplate/success.http');

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.applyTemplate(accountId, templateId, domainId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });
});

describe('template records', function () {
  describe('#listTemplateRecords', function () {
    const accountId = '1010';
    const templateId = '1';
    const fixture = testUtils.fixture('listTemplateRecords/success.http');

    it('supports pagination', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, { sort: 'name:asc' });

      nock.isDone();
      done();
    });

    it('produces a template list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId).then(function (response) {
        const records = response.data;
        expect(records.length).to.eq(2);
        done();
      }, function (error) {
        done(error);
      });
    });

    it('exposes the pagination info', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId).then(function (response) {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allRecords', function () {
    const accountId = '1010';
    const templateId = 1;

    it('produces a complete list', function (done) {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.allTemplateRecords(accountId, templateId).then(function (items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function (error) {
        done(error);
      }).catch(function (error) {
        done(error);
      });
    });
  });

  describe('#getTemplateRecord', function () {
    const accountId = '1010';
    const templateId = 'name';
    const recordId = 1;

    it('produces a template', function (done) {
      const fixture = testUtils.fixture('getTemplateRecord/success.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/name/records/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getTemplateRecord(accountId, templateId, recordId).then(function (response) {
        const record = response.data;
        expect(record.id).to.eq(301);
        expect(record.template_id).to.eq(268);
        expect(record.name).to.eq('');
        expect(record.content).to.eq('mx.example.com');
        expect(record.ttl).to.eq(600);
        expect(record.priority).to.eq(10);
        expect(record.type).to.eq('MX');
        expect(record.created_at).to.eq('2016-05-03T08:03:26Z');
        expect(record.updated_at).to.eq('2016-05-03T08:03:26Z');
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the template does not exist', function () {
      it('produces an error', function (done) {
        const fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/0/records/1')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplateRecord(accountId, 0, recordId).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Template `beta` not found');
          done();
        });
      });
    });

    describe('when the template record does not exist', function () {
      it('produces an error', function (done) {
        const fixture = testUtils.fixture('notfound-record.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/name/records/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplateRecord(accountId, templateId, 0).then(function (response) {
          done();
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#createTemplateRecord', function () {
    const accountId = '1010';
    const templateId = 1;
    const attributes = { content: 'mx.example.com' };
    const fixture = testUtils.fixture('createTemplateRecord/created.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates/1/records', { content: 'mx.example.com' })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplateRecord(accountId, templateId, attributes);

      nock.isDone();
      done();
    });

    it('produces a record', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplateRecord(accountId, templateId, attributes).then(function (response) {
        const record = response.data;
        expect(record.id).to.eq(300);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#deleteTemplateRecord', function () {
    const accountId = '1010';
    const templateId = 1;
    const recordId = 2;
    const fixture = testUtils.fixture('deleteTemplateRecord/success.http');

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/templates/1/records/2')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteTemplateRecord(accountId, templateId, recordId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });
  });
});
