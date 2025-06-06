import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("services", () => {
  describe("#listServices", () => {
    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services?page=1",
        responseFromFixture("listServices/success.http")
      );

      await dnsimple.services.listServices({ page: 1 });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services?foo=bar",
        responseFromFixture("listServices/success.http")
      );

      await dnsimple.services.listServices({ foo: "bar" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services?sort=sid%3Aasc",
        responseFromFixture("listServices/success.http")
      );

      await dnsimple.services.listServices({ sort: "sid:asc" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces a service list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services",
        responseFromFixture("listServices/success.http")
      );

      const response = await dnsimple.services.listServices();

      const services = response.data;
      expect(services.length).toBe(2);
      expect(services[0].name).toBe("Service 1");
      expect(services[0].sid).toBe("service1");
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services",
        responseFromFixture("listServices/success.http")
      );

      const response = await dnsimple.services.listServices();

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listServices.collectAll", () => {
    it("produces a complete list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/services?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/services?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items = await dnsimple.services.listServices.collectAll();

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getService", () => {
    const serviceId = "1";

    it("produces a service", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/services/1",
        responseFromFixture("getService/success.http")
      );

      const response = await dnsimple.services.getService(serviceId);

      expect(response.data.id).toBe(1);
    });
  });
});
