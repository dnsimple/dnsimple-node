import { createTestClient, fetchMockResponse } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#initiatePush", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { new_account_email: "jim@example.com" };

    it("builds the correct request", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/pushes",
        fetchMockResponse("initiatePush/success.http")
      );

      await dnsimple.domains.initiatePush(accountId, domainId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(JSON.stringify(attributes));
    });

    it("produces a push result", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/pushes",
        fetchMockResponse("initiatePush/success.http")
      );

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
      fetchMock.get("https://api.dnsimple.com/v2/1010/pushes", fetchMockResponse("listPushes/success.http"));

      const response = await dnsimple.domains.listPushes(accountId);

      expect(response.data.length).toBe(2);
    });
  });

  describe("#acceptPush", () => {
    const accountId = 1010;
    const pushId = 200;
    const attributes = { contact_id: 1 };

    it("builds the correct request", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/pushes/200", fetchMockResponse("acceptPush/success.http"));

      await dnsimple.domains.acceptPush(accountId, pushId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(JSON.stringify(attributes));
    });

    it("produces nothing", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/pushes/200", fetchMockResponse("acceptPush/success.http"));

      const response = await dnsimple.domains.acceptPush(accountId, pushId, attributes);

      expect(response).toEqual({});
    });
  });

  describe("#rejectPush", () => {
    const accountId = 1010;
    const pushId = 200;

    it("builds the correct request", async () => {
      fetchMock.delete("https://api.dnsimple.com/v2/1010/pushes/200", fetchMockResponse("rejectPush/success.http"));

      await dnsimple.domains.rejectPush(accountId, pushId);

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces nothing", async () => {
      fetchMock.delete("https://api.dnsimple.com/v2/1010/pushes/200", fetchMockResponse("rejectPush/success.http"));

      const response = await dnsimple.domains.rejectPush(accountId, pushId);

      expect(response).toEqual({});
    });
  });
});
