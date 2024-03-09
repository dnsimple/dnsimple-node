import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listEmailForwards", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=1")
        .reply(readFixtureAt("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?foo=bar")
        .reply(readFixtureAt("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?sort=from%3Aasc")
        .reply(readFixtureAt("listEmailForwards/success.http"));

      await dnsimple.domains.listEmailForwards(accountId, domainId, { sort: "from:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces an email forward list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards")
        .reply(readFixtureAt("listEmailForwards/success.http"));

      const response = await dnsimple.domains.listEmailForwards(accountId, domainId);

      expect(response.data.length).toBe(2);
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards")
        .reply(readFixtureAt("listEmailForwards/success.http"));

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
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=1")
        .reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=2")
        .reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=3")
        .reply(readFixtureAt("pages-3of3.http"));

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
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards/41872")
        .reply(readFixtureAt("getEmailForward/success.http"));

      const response = await dnsimple.domains.getEmailForward(accountId, domainId, emailForwardId);

      const emailForward = response.data;
      expect(emailForward.id).toBe(41872);
      expect(emailForward.domain_id).toBe(235146);
      expect(emailForward.from).toBe("example@dnsimple.xyz");
      expect(emailForward.to).toBe("example@example.com");
      expect(emailForward.created_at).toBe("2021-01-25T13:54:40Z");
      expect(emailForward.updated_at).toBe("2021-01-25T13:54:40Z");
    });

    describe("when the email forward does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/domains/example.com/email_forwards/0")
          .reply(readFixtureAt("notfound-emailforward.http"));

        await expect(dnsimple.domains.getEmailForward(accountId, domainId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { alias_name: "jim" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/email_forwards", attributes)
        .reply(readFixtureAt("createEmailForward/created.http"));

      await dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces an email forward", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/email_forwards")
        .reply(readFixtureAt("createEmailForward/created.http"));

      const response = await dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      expect(response.data.id).toBe(41872);
    });
  });

  describe("#deleteEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const emailForwardId = 1;

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/email_forwards/1")
        .reply(readFixtureAt("deleteEmailForward/success.http"));

      const response = await dnsimple.domains.deleteEmailForward(accountId, domainId, emailForwardId);

      expect(response).toEqual({});
    });
  });
});
