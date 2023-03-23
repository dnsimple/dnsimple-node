import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("services", () => {
  describe("#listServices", () => {
    const fixture = loadFixture("listServices/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ foo: "bar" });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services?sort=sid%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({ sort: "sid:asc" });

      nock.isDone();
      done();
    });

    it("produces a service list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(
        (response) => {
          const services = response.data;
          expect(services.length).to.eq(2);
          expect(services[0].name).to.eq("Service 1");
          expect(services[0].sid).to.eq("service1");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).to.not.eq(null);
          expect(pagination.current_page).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listServices.collectAll", () => {
    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/services?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/services?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/services?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.services.listServices
        .collectAll()
        .then(
          (items) => {
            expect(items.length).to.eq(5);
            expect(items[0].id).to.eq(1);
            expect(items[4].id).to.eq(5);
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

  describe("#getService", () => {
    const serviceId = "1";
    const fixture = loadFixture("getService/success.http");

    it("produces a service", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/services/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.getService(serviceId).then(
        (response) => {
          const service = response.data;
          expect(service.id).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
