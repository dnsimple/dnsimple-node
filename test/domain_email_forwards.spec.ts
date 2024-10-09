import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listEmailForwards", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?page=1", fetchMockResponse("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, {
        page: 1,
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?foo=bar", fetchMockResponse("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, {
        foo: "bar",
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports sorting", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?sort=from%3Aasc", fetchMockResponse("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, {
        sort: "from:asc",
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces an email forward list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards", fetchMockResponse("listEmailForwards/success.http"));

      const response = await dnsimple.domains.listEmailForwards(accountId, domainId);

      expect(response.data.length).toBe(1);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards", fetchMockResponse("listEmailForwards/success.http"));

      const response = await dnsimple.domains.listEmailForwards(accountId, domainId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listEmailForwards.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?page=1", fetchMockResponse("pages-1of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?page=2", fetchMockResponse("pages-2of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards?page=3", fetchMockResponse("pages-3of3.http"));

      const items = await dnsimple.domains.listEmailForwards.collectAll(accountId, domainId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const emailForwardId = 41872;

    it("produces an email forward", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards/41872", fetchMockResponse("getEmailForward/success.http"));

      const response = await dnsimple.domains.getEmailForward(accountId, domainId, emailForwardId);

      const emailForward = response.data;
      expect(emailForward.id).toBe(41872);
      expect(emailForward.domain_id).toBe(235146);
      expect(emailForward.from).toBe("example@dnsimple.xyz");
      expect(emailForward.to).toBe("example@example.com");
      expect(emailForward.alias_email).toBe("example@dnsimple.xyz");
      expect(emailForward.destination_email).toBe("example@example.com");
      expect(emailForward.created_at).toBe("2021-01-25T13:54:40Z");
      expect(emailForward.updated_at).toBe("2021-01-25T13:54:40Z");
    });

    describe("when the email forward does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards/0", fetchMockResponse("notfound-emailforward.http"));

        await expect(dnsimple.domains.getEmailForward(accountId, domainId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { alias_name: "jim" };

    it("builds the correct request", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards", fetchMockResponse("createEmailForward/created.http"));

      await dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces an email forward", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards", fetchMockResponse("createEmailForward/created.http"));

      const response = await dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      expect(response.data.id).toBe(41872);
    });
  });

  describe("#deleteEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const emailForwardId = 1;

    it("produces nothing", async () => {
      fetchMock.delete("https://api.dnsimple.com/v2/1010/domains/example.com/email_forwards/1", fetchMockResponse("deleteEmailForward/success.http"));

      const response = await dnsimple.domains.deleteEmailForward(accountId, domainId, emailForwardId);

      expect(response).toEqual({});
    });
  });
});
