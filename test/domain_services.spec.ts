import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("domain services", () => {
  describe("#applyService", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?page=1",
        responseFromFixture("appliedServices/success.http")
      );

      await dnsimple.services.applyService(accountId, domainId, { page: 1 });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?foo=bar",
        responseFromFixture("appliedServices/success.http")
      );

      await dnsimple.services.applyService(accountId, domainId, { foo: "bar" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?sort=name%3Aasc",
        responseFromFixture("appliedServices/success.http")
      );

      await dnsimple.services.applyService(accountId, domainId, {
        sort: "name:asc",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces a service list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services",
        responseFromFixture("appliedServices/success.http")
      );

      const response = await dnsimple.services.applyService(
        accountId,
        domainId
      );

      const services = response.data;
      expect(services.length).toBe(1);
      expect(services[0].name).toBe("WordPress");
    });
  });

  describe("#applyService.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items = await dnsimple.services.applyService.collectAll(
        accountId,
        domainId
      );

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#appliedServices", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const serviceId = "name";

    it("produces nothing", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services/name",
        responseFromFixture("applyService/success.http")
      );

      const response = await dnsimple.services.appliedServices(
        accountId,
        domainId,
        serviceId,
        {}
      );

      expect(response.rateLimit).toBeDefined();
    });
  });

  describe("#unapplyService", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const serviceId = "name";

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com/services/name",
        responseFromFixture("unapplyService/success.http")
      );

      const response = await dnsimple.services.unapplyService(
        accountId,
        domainId,
        serviceId
      );

      expect(response.rateLimit).toBeDefined();
    });
  });
});
