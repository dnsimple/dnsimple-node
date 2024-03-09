import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#initiatePush", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { new_account_email: "jim@example.com" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/pushes", attributes)
        .reply(readFixtureAt("initiatePush/success.http"));

      await dnsimple.domains.initiatePush(accountId, domainId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a push result", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/pushes")
        .reply(readFixtureAt("initiatePush/success.http"));

      const response = await dnsimple.domains.initiatePush(accountId, domainId, attributes);

      const push = response.data;
      expect(push.id).toBe(1);
      expect(push.domain_id).toBe(100);
      expect(push.contact_id).toBe(null);
      expect(push.account_id).toBe(2020);
      expect(push.created_at).toBe("2016-08-11T10:16:03Z");
      expect(push.updated_at).toBe("2016-08-11T10:16:03Z");
      expect(push.accepted_at).toBe(null);
    });
  });

  describe("#listPushes", () => {
    const accountId = 1010;

    it("produces an pushes list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/pushes")
        .reply(readFixtureAt("listPushes/success.http"));

      const response = await dnsimple.domains.listPushes(accountId);

      expect(response.data.length).toBe(2);
    });
  });

  describe("#acceptPush", () => {
    const accountId = 1010;
    const pushId = 200;
    const attributes = { contact_id: 1 };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/pushes/200", attributes)
        .reply(readFixtureAt("acceptPush/success.http"));

      await dnsimple.domains.acceptPush(accountId, pushId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/pushes/200")
        .reply(readFixtureAt("acceptPush/success.http"));

      const response = await dnsimple.domains.acceptPush(accountId, pushId, attributes);

      expect(response).toEqual({});
    });
  });

  describe("#rejectPush", () => {
    const accountId = 1010;
    const pushId = 200;

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .delete("/v2/1010/pushes/200")
        .reply(readFixtureAt("rejectPush/success.http"));

      await dnsimple.domains.rejectPush(accountId, pushId);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/pushes/200")
        .reply(readFixtureAt("rejectPush/success.http"));

      const response = await dnsimple.domains.rejectPush(accountId, pushId);

      expect(response).toEqual({});
    });
  });
});
