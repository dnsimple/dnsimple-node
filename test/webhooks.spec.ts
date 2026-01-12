import fetchMock from "fetch-mock";
import { NotFoundError } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("webhooks", () => {
  describe("#listWebhooks", () => {
    const accountId = 1010;

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/webhooks?foo=bar",
        responseFromFixture("listWebhooks/success.http")
      );

      await dnsimple.webhooks.listWebhooks(accountId, { foo: "bar" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces a webhook list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/webhooks",
        responseFromFixture("listWebhooks/success.http")
      );

      const response = await dnsimple.webhooks.listWebhooks(accountId);

      const webhooks = response.data;
      expect(webhooks.length).toBe(2);
      expect(webhooks[0].id).toBe(1);
    });
  });

  describe("#listWebhooks", () => {
    const accountId = 1010;

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/webhooks?foo=bar",
        responseFromFixture("listWebhooks/success.http")
      );

      await dnsimple.webhooks.listWebhooks(accountId, { foo: "bar" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces a webhook list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/webhooks",
        responseFromFixture("listWebhooks/success.http")
      );

      const response = await dnsimple.webhooks.listWebhooks(accountId);

      const items = response.data;
      expect(items.length).toBe(2);
      expect(items[0].id).toBe(1);
    });
  });

  describe("#getWebhook", () => {
    const accountId = 1010;
    const webhookId = 1;

    it("produces a webhook", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/webhooks/1",
        responseFromFixture("getWebhook/success.http")
      );

      const response = await dnsimple.webhooks.getWebhook(accountId, webhookId);

      const webhook = response.data;
      expect(webhook.id).toBe(1);
      expect(webhook.url).toBe("https://webhook.test");
    });

    describe("when the webhook does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/webhooks/0",
          responseFromFixture("notfound-webhook.http")
        );

        await expect(
          dnsimple.webhooks.getWebhook(accountId, 0)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createWebhook", () => {
    const accountId = 1010;
    const attributes = { url: "https://some-site.com" };

    it("builds the correct request", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/webhooks",
        responseFromFixture("createWebhook/created.http")
      );

      await dnsimple.webhooks.createWebhook(accountId, attributes);

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(
        JSON.stringify(attributes)
      );
    });

    it("produces a webhook", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/webhooks",
        responseFromFixture("createWebhook/created.http")
      );

      const response = await dnsimple.webhooks.createWebhook(
        accountId,
        attributes
      );

      expect(response.data.id).toBe(1);
    });
  });

  describe("#deleteWebhook", () => {
    const accountId = 1010;
    const webhookId = 1;

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/webhooks/1",
        responseFromFixture("deleteWebhook/success.http")
      );

      const response = await dnsimple.webhooks.deleteWebhook(
        accountId,
        webhookId
      );

      expect(response.rateLimit).toBeDefined();
    });

    describe("when the webhook does not exist", () => {
      it("produces an error", async () => {
        fetchMock.delete(
          "https://api.dnsimple.com/v2/1010/webhooks/0",
          responseFromFixture("notfound-webhook.http")
        );

        await expect(
          dnsimple.webhooks.deleteWebhook(accountId, 0)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });
});
