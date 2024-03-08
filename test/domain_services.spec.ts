import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domain services", () => {
  describe("#applyService", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("appliedServices/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId, {
        page: 1,
      });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId, {
        foo: "bar",
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?sort=name%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId, {
        sort: "name:asc",
      });

      nock.isDone();
      done();
    });

    it("produces a service list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.applyService(accountId, domainId).then(
        (response) => {
          const services = response.data;
          expect(services.length).toBe(1);
          expect(services[0].name).toBe("WordPress");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#applyService.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/services?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.applyService
        .collectAll(accountId, domainId)
        .then(
          (items) => {
            expect(items.length).toBe(5);
            expect(items[0].id).toBe(1);
            expect(items[4].id).toBe(5);
            done();
          },
          (error) => {
            done(error);
          }
        )
        .catch((error) => {
          done(error);
        });
    });
  });

  describe("#appliedServices", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const serviceId = "name";

    it("produces nothing", (done) => {
      const fixture = loadFixture("applyService/success.http");

      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/services/name")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services
        .appliedServices(accountId, domainId, serviceId, {})
        .then(
          (response) => {
            expect(response).toEqual({});
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#unapplyService", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const serviceId = "name";

    it("produces nothing", (done) => {
      const fixture = loadFixture("unapplyService/success.http");

      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/services/name")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.unapplyService(accountId, domainId, serviceId).then(
        (response) => {
          expect(response).toEqual({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
