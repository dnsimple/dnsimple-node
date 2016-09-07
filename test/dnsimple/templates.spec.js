'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('templates', function() {
  describe('#listTemplates', function() {
    var accountId = '1010';
    var fixture = testUtils.fixture('listTemplates/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, {sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('produces a template list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function(response) {
        var templates = response.data;
        expect(templates.length).to.eq(2);
        expect(templates[0].name).to.eq('Alpha');
        expect(templates[0].account_id).to.eq(1010);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allTemplates', function() {
    var accountId = '1010';

    it('produces a complete list', function(done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.allTemplates(accountId).then(function(items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function(error) {
        done(error);
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('#getTemplate', function() {
    var accountId = '1010';
    var templateId = 'name';

    it('produces a template', function(done) {
      var fixture = testUtils.fixture('getTemplate/success.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getTemplate(accountId, templateId).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        expect(template.account_id).to.eq(1010);
        expect(template.name).to.eq('Alpha');
        expect(template.short_name).to.eq('alpha');
        expect(template.description).to.eq('An alpha template.');
        expect(template.created_at).to.eq('2016-03-22T11:08:58.262Z');
        expect(template.updated_at).to.eq('2016-03-22T11:08:58.262Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the template does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/name')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplate(accountId, templateId).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#createTemplate', function() {
    var accountId = '1010';
    var attributes = {name: 'Beta'};
    var fixture = testUtils.fixture('createTemplate/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/templates', {name: 'Beta'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes);

      endpoint.done();
      done();
    });

    it('produces a template', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#updateTemplate', function() {
    var accountId = '1010';
    var templateId = 1;
    var attributes = {name: 'Alpha'};
    var fixture = testUtils.fixture('updateTemplate/success.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1', {name: 'Alpha'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes);

      endpoint.done();
      done();
    });

    it('produces a template', function(done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function(response) {
        var template = response.data;
        expect(template.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the template does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .patch('/v2/1010/templates/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#deleteTemplate', function() {
    var accountId = '1010';
    var templateId = 1;
    var fixture = testUtils.fixture('deleteTemplate/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteTemplate(accountId, templateId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#applyTemplate', function() {
    var accountId = '1010';
    var domainId = 'example.com'
    var templateId = 1;
    var fixture = testUtils.fixture('applyTemplate/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/domains/example.com/templates/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.applyTemplate(accountId, templateId, domainId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });

});

describe('template records', function() {
  describe('#listRecords', function() {
    var accountId = '1010';
    var templateId = '1';
    var fixture = testUtils.fixture('listTemplateRecords/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listRecords(accountId, templateId, {page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listRecords(accountId, templateId, {query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listRecords(accountId, templateId, {sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('produces a template list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listRecords(accountId, templateId).then(function(response) {
        var records = response.data;
        expect(records.length).to.eq(2);
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listRecords(accountId, templateId).then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#allRecords', function() {
    var accountId = '1010';
    var templateId = 1;

    it('produces a complete list', function(done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/1/records?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.allRecords(accountId, templateId).then(function(items) {
        expect(items.length).to.eq(5);
        expect(items[0].id).to.eq(1);
        expect(items[4].id).to.eq(5);
        done();
      }, function(error) {
        done(error);
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('#getRecord', function() {
    var accountId = '1010';
    var templateId = 'name';
    var recordId = 1;

    it('produces a template', function(done) {
      var fixture = testUtils.fixture('getTemplateRecord/success.http');

      nock('https://api.dnsimple.com')
        .get('/v2/1010/templates/name/records/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getRecord(accountId, templateId, recordId).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(301);
        expect(record.template_id).to.eq(268);
        expect(record.name).to.eq('');
        expect(record.content).to.eq('mx.example.com');
        expect(record.ttl).to.eq(600);
        expect(record.priority).to.eq(10);
        expect(record.type).to.eq('MX');
        expect(record.created_at).to.eq('2016-05-03T08:03:26.444Z');
        expect(record.updated_at).to.eq('2016-05-03T08:03:26.444Z');
        done();
      }, function(error) {
        done(error);
      });
    });

    describe('when the template does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-template.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/0/records/1')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getRecord(accountId, 0, recordId).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });

    describe('when the template record does not exist', function() {
      it('produces an error', function(done) {
        var fixture = testUtils.fixture('notfound-record.http');

        nock('https://api.dnsimple.com')
          .get('/v2/1010/templates/name/records/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getRecord(accountId, templateId, 0).then(function(response) {
          done();
        }, function(error) {
          expect(error).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('#createRecord', function() {
    var accountId = '1010';
    var templateId = 1;
    var attributes = {content: 'mx.example.com'};
    var fixture = testUtils.fixture('createTemplateRecord/created.http');

    it('builds the correct request', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .post('/v2/1010/templates/1/records', {content: 'mx.example.com'})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createRecord(accountId, templateId, attributes);

      endpoint.done();
      done();
    });

    it('produces a record', function(done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/templates/1/records')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createRecord(accountId, templateId, attributes).then(function(response) {
        var record = response.data;
        expect(record.id).to.eq(300);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#deleteRecord', function() {
    var accountId = '1010';
    var templateId = 1;
    var recordId = 2;
    var fixture = testUtils.fixture('deleteTemplateRecord/success.http');

    it('produces nothing', function(done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/templates/1/records/2')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteRecord(accountId, templateId, recordId).then(function(response) {
        expect(response).to.eql({});
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
