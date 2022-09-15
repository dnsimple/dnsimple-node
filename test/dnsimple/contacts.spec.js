'use strict';

const testUtils = require('../testUtils');
const dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken()
});

const expect = require('chai').expect;
const nock = require('nock');

describe('contacts', () => {
  describe('#listContacts', () => {
    const accountId = '1010';
    const fixture = testUtils.fixture('listContacts/success.http');

    it('supports pagination', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it('supports extra request options', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { query: { foo: 'bar' } });

      nock.isDone();
      done();
    });

    it('supports sorting', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?sort=first_name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { sort: 'first_name:asc' });

      nock.isDone();
      done();
    });

    it('supports filter', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?first_name_like=example')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId, { filter: { first_name_like: 'example' } });

      nock.isDone();
      done();
    });

    it('produces a contact list', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId).then((response) => {
        const contacts = response.data;
        expect(contacts.length).to.eq(2);
        expect(contacts[0].account_id).to.eq(1010);
        expect(contacts[0].label).to.eq('Default');
        expect(contacts[0].first_name).to.eq('First');
        expect(contacts[0].last_name).to.eq('User');
        done();
      }, (error) => {
        done(error);
      });
    });

    it('exposes the pagination info', (done) => {
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.listContacts(accountId).then((response) => {
        const pagination = response.pagination;
        expect(pagination).to.not.eq(null);
        expect(pagination.current_page).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });
  });

  describe('#allContacts', () => {
    const accountId = '1010';

    it('produces a complete list', (done) => {
      const fixture1 = testUtils.fixture('pages-1of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=1')
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture('pages-2of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=2')
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture('pages-3of3.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts?page=3')
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.contacts.allContacts(accountId).then((contacts) => {
        expect(contacts.length).to.eq(5);
        expect(contacts[0].id).to.eq(1);
        expect(contacts[4].id).to.eq(5);
        done();
      }, (error) => {
        done(error);
      }).catch((error) => {
        done(error);
      });
    });
  });

  describe('#getContact', () => {
    const accountId = '1010';

    it('produces a contact', (done) => {
      const fixture = testUtils.fixture('getContact/success.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts/1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.getContact(accountId, 1).then((response) => {
        const contact = response.data;
        expect(contact.id).to.eq(1);
        expect(contact.account_id).to.eq(1010);
        expect(contact.label).to.eq('Default');
        expect(contact.first_name).to.eq('First');
        expect(contact.last_name).to.eq('User');
        done();
      }, (error) => {
        console.log(error);
        done(error);
      });
    });

    describe('when the contact does not exist', () => {
      it('produces an error', (done) => {
        const fixture = testUtils.fixture('notfound-contact.http');
        nock('https://api.dnsimple.com')
          .get('/v2/1010/contacts/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.contacts.getContact(accountId, '0').then((response) => {
          done('Error expected but future resolved');
        }, (error) => {
          expect(error).to.not.eq(null);
          expect(error.description).to.eq('Not found');
          expect(error.message).to.eq('Contact `0` not found');
          done();
        });
      });
    });
  });

  describe('#createContact', () => {
    const accountId = '1010';
    const attributes = { first_name: 'John', last_name: 'Smith' };
    const fixture = testUtils.fixture('createContact/created.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/contacts', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.createContact(accountId, attributes);

      nock.isDone();
      done();
    });

    it('produces a contact', (done) => {
      nock('https://api.dnsimple.com')
        .post('/v2/1010/contacts', attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.createContact(accountId, attributes).then((response) => {
        const contact = response.data;
        expect(contact.id).to.eq(1);
        expect(contact.account_id).to.eq(1010);
        expect(contact.label).to.eq('Default');
        expect(contact.first_name).to.eq('First');
        expect(contact.last_name).to.eq('User');
        done();
      }, (error) => {
        done(error);
      });
    });

    it('includes validation errors coming from the API', async () => {
      const fixture = testUtils.fixture('createContact/error-validation-errors.http');

      nock('https://api.dnsimple.com')
        .post('/v2/1010/contacts', attributes)
        .reply(fixture.statusCode, fixture.body);

      return dnsimple.contacts.createContact(accountId, attributes).then(() => {
        throw new Error('The promise should follow the rejection path');
      }, (error) => {
        expect(error.errors.address1).to.deep.eq(["can't be blank"]);
        expect(error.errors.city).to.deep.eq(["can't be blank"]);
        expect(error.errors.country).to.deep.eq(["can't be blank"]);
        expect(error.errors.email).to.deep.eq(["can't be blank", 'is an invalid email address']);
        expect(error.errors.first_name).to.deep.eq(["can't be blank"]);
        expect(error.errors.last_name).to.deep.eq(["can't be blank"]);
        expect(error.errors.phone).to.deep.eq(["can't be blank", 'is probably not a phone number']);
        expect(error.errors.postal_code).to.deep.eq(["can't be blank"]);
        expect(error.errors.state_province).to.deep.eq(["can't be blank"]);
      });
    });
  });

  describe('#updateContact', () => {
    const accountId = '1010';
    const contactId = 1;
    const attributes = { last_name: 'Buckminster' };
    const fixture = testUtils.fixture('updateContact/success.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/contacts/' + contactId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.updateContact(accountId, contactId, attributes);

      nock.isDone();
      done();
    });

    it('produces a contact', (done) => {
      nock('https://api.dnsimple.com')
        .patch('/v2/1010/contacts/' + contactId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.updateContact(accountId, contactId, attributes).then((response) => {
        const contact = response.data;
        expect(contact.id).to.eq(1);
        done();
      }, (error) => {
        done(error);
      });
    });

    describe('when the contact does not exist', () => {
      const fixture = testUtils.fixture('notfound-contact.http');
      nock('https://api.dnsimple.com')
        .get('/v2/1010/contacts/0', attributes)
        .reply(fixture.statusCode, fixture.body);

      it('produces an error', (done) => {
        dnsimple.contacts.updateContact(accountId, '0', attributes).then((response) => {
          done('Expected error but future resolved');
        }, (error) => {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });

  describe('#deleteContact', () => {
    const accountId = '1010';
    const contactId = 1;
    const fixture = testUtils.fixture('deleteContact/success.http');

    it('builds the correct request', (done) => {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/contacts/' + contactId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.deleteContact(accountId, contactId);

      nock.isDone();
      done();
    });

    it('produces nothing', (done) => {
      nock('https://api.dnsimple.com')
        .delete('/v2/1010/contacts/' + contactId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.contacts.deleteContact(accountId, contactId).then((response) => {
        expect(response).to.eql({});
        done();
      }, (error) => {
        done(error);
      });
    });

    describe('when the contact does not exist', () => {
      it('produces an error', (done) => {
        const fixture = testUtils.fixture('notfound-contact.http');
        nock('https://api.dnsimple.com')
          .delete('/v2/1010/contacts/0')
          .reply(fixture.statusCode, fixture.body);

        dnsimple.contacts.deleteContact(accountId, '0').then((response) => {
          done('Error expected but future resolved');
        }, (error) => {
          expect(error).to.not.eq(null);
          done();
        });
      });
    });
  });
});
