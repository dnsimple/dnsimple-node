import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("services", () => {
  describe("#listServices", () => {
    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com").get("/v2/services?page=1").reply(readFixtureAt("listServices/success.http"));

      await dnsimple.services.listServices({ page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com").get("/v2/services?foo=bar").reply(readFixtureAt("listServices/success.http"));

      await dnsimple.services.listServices({ foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com").get("/v2/services?sort=sid%3Aasc").reply(readFixtureAt("listServices/success.http"));

      await dnsimple.services.listServices({ sort: "sid:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a service list", async () => {
      nock("https://api.dnsimple.com").get("/v2/services").reply(readFixtureAt("listServices/success.http"));

      const response = await dnsimple.services.listServices();

      const services = response.data;
      expect(services.length).toBe(2);
      expect(services[0].name).toBe("Service 1");
      expect(services[0].sid).toBe("service1");
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com").get("/v2/services").reply(readFixtureAt("listServices/success.http"));

      const response = await dnsimple.services.listServices();

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listServices.collectAll", () => {
    it("produces a complete list", async () => {
      nock("https://api.dnsimple.com").get("/v2/services?page=1").reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com").get("/v2/services?page=2").reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com").get("/v2/services?page=3").reply(readFixtureAt("pages-3of3.http"));

      const items = await dnsimple.services.listServices.collectAll();

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getService", () => {
    const serviceId = "1";

    it("produces a service", async () => {
      nock("https://api.dnsimple.com").get("/v2/services/1").reply(readFixtureAt("getService/success.http"));

      const response = await dnsimple.services.getService(serviceId);

      expect(response.data.id).toBe(1);
    });
  });
});
