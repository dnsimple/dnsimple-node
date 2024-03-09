import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domain services", () => {
  describe("#applyService", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=1")
        .reply(readFixtureAt("appliedServices/success.http"));

      await dnsimple.services.applyService(accountId, domainId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?foo=bar")
        .reply(readFixtureAt("appliedServices/success.http"));

      await dnsimple.services.applyService(accountId, domainId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?sort=name%3Aasc")
        .reply(readFixtureAt("appliedServices/success.http"));

      await dnsimple.services.applyService(accountId, domainId, { sort: "name:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a service list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services")
        .reply(readFixtureAt("appliedServices/success.http"));

      const response = await dnsimple.services.applyService(accountId, domainId);

      const services = response.data;
      expect(services.length).toBe(1);
      expect(services[0].name).toBe("WordPress");
    });
  });

  describe("#applyService.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=1")
        .reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=2")
        .reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=3")
        .reply(readFixtureAt("pages-3of3.http"));

      const items = await dnsimple.services.applyService.collectAll(accountId, domainId);

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
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/services/name")
        .reply(readFixtureAt("applyService/success.http"));

      const response = await dnsimple.services.appliedServices(accountId, domainId, serviceId, {});

      expect(response).toEqual({});
    });
  });

  describe("#unapplyService", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const serviceId = "name";

    it("produces nothing", async () => {

      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/services/name")
        .reply(readFixtureAt("unapplyService/success.http"));

      const response = await dnsimple.services.unapplyService(accountId, domainId, serviceId);

      expect(response).toEqual({});
    });
  });
});
