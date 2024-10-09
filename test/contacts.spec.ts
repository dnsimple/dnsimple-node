import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("contacts", () => {
  describe("#listContacts", () => {
    const accountId = 1010;

    it("supports pagination", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts?page=1", fetchMockResponse("listContacts/success.http"));

      await dnsimple.contacts.listContacts(accountId, { page: 1 });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/contacts?foo=bar",
        fetchMockResponse("listContacts/success.http")
      );

      await dnsimple.contacts.listContacts(accountId, { foo: "bar" });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/contacts?sort=label%3Aasc",
        fetchMockResponse("listContacts/success.http")
      );

      await dnsimple.contacts.listContacts(accountId, { sort: "label:asc" });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports filter", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/contacts?first_name_like=example",
        fetchMockResponse("listContacts/success.http")
      );

      await dnsimple.contacts.listContacts(accountId, {
        first_name_like: "example",
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces a contact list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts", fetchMockResponse("listContacts/success.http"));

      const response = await dnsimple.contacts.listContacts(accountId);

      const contacts = response.data;
      expect(contacts.length).toBe(2);
      expect(contacts[0].account_id).toBe(1010);
      expect(contacts[0].label).toBe("Default");
      expect(contacts[0].first_name).toBe("First");
      expect(contacts[0].last_name).toBe("User");
    });

    it("exposes the pagination info", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts", fetchMockResponse("listContacts/success.http"));

      const response = await dnsimple.contacts.listContacts(accountId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listContacts.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts?page=1", fetchMockResponse("pages-1of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts?page=2", fetchMockResponse("pages-2of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts?page=3", fetchMockResponse("pages-3of3.http"));

      const contacts = await dnsimple.contacts.listContacts.collectAll(accountId);

      expect(contacts.length).toBe(5);
      expect(contacts[0].id).toBe(1);
      expect(contacts[4].id).toBe(5);
    });
  });

  describe("#getContact", () => {
    const accountId = 1010;

    it("produces a contact", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/contacts/1", fetchMockResponse("getContact/success.http"));

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
        fetchMock.get("https://api.dnsimple.com/v2/1010/contacts/0", fetchMockResponse("notfound-contact.http"));

        await expect(dnsimple.contacts.getContact(accountId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createContact", () => {
    const accountId = 1010;
    const attributes = { first_name: "John", last_name: "Smith" };

    it("builds the correct request", async () => {
      const expectedPayload = attributes;
      fetchMock.post("https://api.dnsimple.com/v2/1010/contacts", fetchMockResponse("createContact/created.http"));

      await dnsimple.contacts.createContact(accountId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(JSON.stringify(expectedPayload));
    });

    it("produces a contact", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/contacts", fetchMockResponse("createContact/created.http"));

      const response = await dnsimple.contacts.createContact(accountId, attributes);

      const contact = response.data;
      expect(contact.id).toBe(1);
      expect(contact.account_id).toBe(1010);
      expect(contact.label).toBe("Default");
      expect(contact.first_name).toBe("First");
      expect(contact.last_name).toBe("User");
    });

    it("includes validation errors coming from the API", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/contacts",
        fetchMockResponse("createContact/error-validation-errors.http")
      );

      try {
        await dnsimple.contacts.createContact(accountId, attributes);
      } catch (error) {
        expect(error.attributeErrors().address1).toEqual(["can't be blank"]);
        expect(error.attributeErrors().city).toEqual(["can't be blank"]);
        expect(error.attributeErrors().country).toEqual(["can't be blank"]);
        expect(error.attributeErrors().email).toEqual(["can't be blank", "is an invalid email address"]);
        expect(error.attributeErrors().first_name).toEqual(["can't be blank"]);
        expect(error.attributeErrors().last_name).toEqual(["can't be blank"]);
        expect(error.attributeErrors().phone).toEqual(["can't be blank", "is probably not a phone number"]);
        expect(error.attributeErrors().postal_code).toEqual(["can't be blank"]);
        expect(error.attributeErrors().state_province).toEqual(["can't be blank"]);
      }
    });
  });

  describe("#updateContact", () => {
    const accountId = 1010;
    const contactId = 1;
    const attributes = { last_name: "Buckminster" };

    it("builds the correct request", async () => {
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/contacts/" + contactId,
        fetchMockResponse("updateContact/success.http")
      );

      await dnsimple.contacts.updateContact(accountId, contactId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(JSON.stringify(attributes));
    });

    it("produces a contact", async () => {
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/contacts/" + contactId,
        fetchMockResponse("updateContact/success.http")
      );

      const response = await dnsimple.contacts.updateContact(accountId, contactId, attributes);

      expect(response.data.id).toBe(1);
    });

    describe("when the contact does not exist", () => {
      it("produces an error", async () => {
        fetchMock.patch("https://api.dnsimple.com/v2/1010/contacts/0", fetchMockResponse("notfound-contact.http"));

        await expect(dnsimple.contacts.updateContact(accountId, 0, attributes)).rejects.toThrow();
      });
    });
  });

  describe("#deleteContact", () => {
    const accountId = 1010;
    const contactId = 1;

    it("builds the correct request", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/contacts/" + contactId,
        fetchMockResponse("deleteContact/success.http")
      );

      await dnsimple.contacts.deleteContact(accountId, contactId);

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/contacts/" + contactId,
        fetchMockResponse("deleteContact/success.http")
      );

      const response = await dnsimple.contacts.deleteContact(accountId, contactId);

      expect(response).toEqual({});
    });

    describe("when the contact does not exist", () => {
      it("produces an error", async () => {
        fetchMock.delete("https://api.dnsimple.com/v2/1010/contacts/0", fetchMockResponse("notfound-contact.http"));

        await expect(dnsimple.contacts.deleteContact(accountId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });
});
