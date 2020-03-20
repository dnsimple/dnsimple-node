'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('contacts', function () {
  describe('#listContacts', function () {
    var accountId = '1010';
    var fixture = testUtils.fixture('listContacts/success.http');

    it('supports pagination', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?sort=first_name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { sort: 'first_name:asc' });

      nock.isDone();
      done();
    });

    it('supports filter', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?first_name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { filter: { first_name_like: 'example' } });

      nock.isDone();
      done();
    });

    it('produces a contact list', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId).then(function (response) {
        var contacts = response.data;
        expect(contacts.length).to.eq(2);
        expect(contacts[0].account_id).to.eq(1010);
        expect(contacts[0].label).to.eq('Default');
        expect(contacts[0].first_name).to.eq('First');
        expect(contacts[0].last_name).to.eq('User');
        done();
      }, function (error) {
        done(error);
      });
    });

    it('exposes the pagination info', function (done) {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId).then(function (response) {
        var pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#allContacts', function () {
    var accountId = '1010';

    it('produces a complete list', function (done) {
      var fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      var fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      var fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.contacts.allContacts(accountId).then(function (contacts) {
        expect(contacts.length).to.eq(5);
        expect(contacts[0].id).to.eq(1);
        expect(contacts[4].id).to.eq(5);
        done();
      }, function (error) {
        done(error);
      }).catch(function (error) {
        done(error);
      });
    });
  });

  describe('#getContact', function () {
    var accountId = '1010';

    it('produces a contact', function (done) {
      var fixture = testUtils.fixture('getContact/success.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.getContact(accountId, 1).then(function (response) {
        var contact = response.data;
        expect(contact.id).to.eq(1);
        expect(contact.account_id).to.eq(1010);
        expect(contact.label).to.eq('Default');
        expect(contact.first_name).to.eq('First');
        expect(contact.last_name).to.eq('User');
        done();
      }, function (error) {
        console.log(error);
        done(error);
      });
    });

    describe('when the contact does not exist', function () {
      it('produces an error', function (done) {
        var fixture = testUtils.fixture('notfound-contact.http');
        nock('https://api.dnsimple.com')
          .get('/v2/1010/contacts/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.contacts.getContact(accountId, '0').then(function (response) {
          done('Error expected but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Contact `0` not found');
          done();
        });
      });
    });
  });

  describe('#createContact', function () {
    var accountId = '1010';
    var attributes = { first_name: 'John', last_name: 'Smith' };
    var fixture = testUtils.fixture('createContact/created.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/contacts', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.createContact(accountId, attributes);

      nock.isDone();
      done();
    });

    it('produces a contact', function (done) {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/contacts', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.createContact(accountId, attributes).then(function (response) {
        var contact = response.data;
        expect(contact.id).to.eq(1);
        expect(contact.account_id).to.eq(1010);
        expect(contact.label).to.eq('Default');
        expect(contact.first_name).to.eq('First');
        expect(contact.last_name).to.eq('User');
        done();
      }, function (error) {
        done(error);
      });
    });
  });

  describe('#updateContact', function () {
    var accountId = '1010';
    var contactId = 1;
    var attributes = { last_name: 'Buckminster' };
    var fixture = testUtils.fixture('updateContact/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/contacts/' + contactId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.updateContact(accountId, contactId, attributes);

      nock.isDone();
      done();
    });

    it('produces a contact', function (done) {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/contacts/' + contactId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.updateContact(accountId, contactId, attributes).then(function (response) {
        var contact = response.data;
        expect(contact.id).to.eq(1);
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the contact does not exist', function () {
      var fixture = testUtils.fixture('notfound-contact.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts/0', attributes)
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', function (done) {
        dnsimple.contacts.updateContact(accountId, '0', attributes).then(function (response) {
          done('Expected error but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#deleteContact', function () {
    var accountId = '1010';
    var contactId = 1;
    var fixture = testUtils.fixture('deleteContact/success.http');

    it('builds the correct request', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/contacts/' + contactId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.deleteContact(accountId, contactId);

      nock.isDone();
      done();
    });

    it('produces nothing', function (done) {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/contacts/' + contactId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.deleteContact(accountId, contactId).then(function (response) {
        expect(response).to.eql({});
        done();
      }, function (error) {
        done(error);
      });
    });

    describe('when the contact does not exist', function () {
      it('produces an error', function (done) {
        var fixture = testUtils.fixture('notfound-contact.http');
        nock('https://api.dnsimple.com')
          .delete('/v2/1010/contacts/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.contacts.deleteContact(accountId, '0').then(function (response) {
          done('Error expected but future resolved');
        }, function (error) {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });
});
