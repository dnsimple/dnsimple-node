import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("contacts", () => {
  describe("#listContacts", () => {
    const accountId = 1010;

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?page=1")
        .reply(readFixtureAt("listContacts/success.http"));

      await dnsimple.contacts.listContacts(accountId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?foo=bar")
        .reply(readFixtureAt("listContacts/success.http"));

      await dnsimple.contacts.listContacts(accountId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?sort=label%3Aasc")
        .reply(readFixtureAt("listContacts/success.http"));

      await dnsimple.contacts.listContacts(accountId, { sort: "label:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports filter", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?first_name_like=example")
        .reply(readFixtureAt("listContacts/success.http"));

      await dnsimple.contacts.listContacts(accountId, { first_name_like: "example" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a contact list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts")
        .reply(readFixtureAt("listContacts/success.http"));

      const response = await dnsimple.contacts.listContacts(accountId);

      const contacts = response.data;
      expect(contacts.length).toBe(2);
      expect(contacts[0].account_id).toBe(1010);
      expect(contacts[0].label).toBe("Default");
      expect(contacts[0].first_name).toBe("First");
      expect(contacts[0].last_name).toBe("User");
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts")
        .reply(readFixtureAt("listContacts/success.http"));

      const response = await dnsimple.contacts.listContacts(accountId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listContacts.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?page=1")
        .reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?page=2")
        .reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts?page=3")
        .reply(readFixtureAt("pages-3of3.http"));

      const contacts = await dnsimple.contacts.listContacts.collectAll(accountId);

      expect(contacts.length).toBe(5);
      expect(contacts[0].id).toBe(1);
      expect(contacts[4].id).toBe(5);
    });
  });

  describe("#getContact", () => {
    const accountId = 1010;

    it("produces a contact", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/contacts/1")
        .reply(readFixtureAt("getContact/success.http"));

      const response = await dnsimple.contacts.getContact(accountId, 1);

      const contact = response.data;
      expect(contact.id).toBe(1);
      expect(contact.account_id).toBe(1010);
      expect(contact.label).toBe("Default");
      expect(contact.first_name).toBe("First");
      expect(contact.last_name).toBe("User");
    });

    describe("when the contact does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/contacts/0")
          .reply(readFixtureAt("notfound-contact.http"));

        await expect(dnsimple.contacts.getContact(accountId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createContact", () => {
    const accountId = 1010;
    const attributes = { first_name: "John", last_name: "Smith" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/contacts", attributes)
        .reply(readFixtureAt("createContact/created.http"));

      await dnsimple.contacts.createContact(accountId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a contact", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/contacts", attributes)
        .reply(readFixtureAt("createContact/created.http"));

      const response = await dnsimple.contacts.createContact(accountId, attributes);

      const contact = response.data;
      expect(contact.id).toBe(1);
      expect(contact.account_id).toBe(1010);
      expect(contact.label).toBe("Default");
      expect(contact.first_name).toBe("First");
      expect(contact.last_name).toBe("User");
    });

    it("includes validation errors coming from the API", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/contacts", attributes)
        .reply(readFixtureAt("createContact/error-validation-errors.http"));

      try {
        await dnsimple.contacts.createContact(accountId, attributes);
      } catch (error) {
        expect(error.attributeErrors().address1).toEqual(["can't be blank"]);
        expect(error.attributeErrors().city).toEqual(["can't be blank"]);
        expect(error.attributeErrors().country).toEqual(["can't be blank"]);
        expect(error.attributeErrors().email).toEqual([
          "can't be blank",
          "is an invalid email address",
        ]);
        expect(error.attributeErrors().first_name).toEqual([
          "can't be blank",
        ]);
        expect(error.attributeErrors().last_name).toEqual(["can't be blank"]);
        expect(error.attributeErrors().phone).toEqual([
          "can't be blank",
          "is probably not a phone number",
        ]);
        expect(error.attributeErrors().postal_code).toEqual([
          "can't be blank",
        ]);
        expect(error.attributeErrors().state_province).toEqual([
          "can't be blank",
        ]);
      }
    });
  });

  describe("#updateContact", () => {
    const accountId = 1010;
    const contactId = 1;
    const attributes = { last_name: "Buckminster" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .patch("/v2/1010/contacts/" + contactId, attributes)
        .reply(readFixtureAt("updateContact/success.http"));

      await dnsimple.contacts.updateContact(accountId, contactId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a contact", async () => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/contacts/" + contactId, attributes)
        .reply(readFixtureAt("updateContact/success.http"));

      const response = await dnsimple.contacts.updateContact(accountId, contactId, attributes);

      const contact = response.data;
      expect(contact.id).toBe(1);
    });

    describe("when the contact does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/contacts/0", attributes)
          .reply(readFixtureAt("notfound-contact.http"));

        await expect(dnsimple.contacts.updateContact(accountId, 0, attributes)).rejects.toThrow();
      });
    });
  });

  describe("#deleteContact", () => {
    const accountId = 1010;
    const contactId = 1;

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .delete("/v2/1010/contacts/" + contactId)
        .reply(readFixtureAt("deleteContact/success.http"));

      await dnsimple.contacts.deleteContact(accountId, contactId);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/contacts/" + contactId)
        .reply(readFixtureAt("deleteContact/success.http"));

      const response = await dnsimple.contacts.deleteContact(accountId, contactId);

      expect(response).toEqual({});
    });

    describe("when the contact does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .delete("/v2/1010/contacts/0")
          .reply(readFixtureAt("notfound-contact.http"));

        await expect(dnsimple.contacts.deleteContact(accountId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });
});
