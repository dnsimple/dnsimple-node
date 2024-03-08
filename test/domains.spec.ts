import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listDomains", () => {
    const accountId = 1010;
    const fixture = loadFixture("listDomains/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, { foo: "bar" });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?sort=expiration%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, { sort: "expiration:asc" });

      nock.isDone();
      done();
    });

    it("supports filter", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?name_like=example")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId, {
        name_like: "example",
      });

      nock.isDone();
      done();
    });

    it("produces a domain list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId).then(
        (response) => {
          const domains = response.data;
          expect(domains.length).toBe(2);
          expect(domains[0].name).toBe("example-alpha.com");
          expect(domains[0].account_id).toBe(1385);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDomains(accountId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).not.toBe(null);
          expect(pagination.current_page).toBe(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listDomains.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.domains.listDomains
        .collectAll(accountId)
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

  describe("#getDomain", () => {
    const accountId = 1385;
    const domainId = "example-alpha.com";
    const fixture = loadFixture("getDomain/success.http");

    it("produces a domain", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1385/domains/example-alpha.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDomain(accountId, domainId).then(
        (response) => {
          const domain = response.data;
          expect(domain.id).toBe(181984);
          expect(domain.account_id).toBe(1385);
          expect(domain.registrant_id).toBe(2715);
          expect(domain.name).toBe("example-alpha.com");
          expect(domain.state).toBe("registered");
          expect(domain.auto_renew).toBe(false);
          expect(domain.private_whois).toBe(false);
          expect(domain.expires_on).toBe("2021-06-05");
          expect(domain.expires_at).toBe("2021-06-05T02:15:00Z");
          expect(domain.created_at).toBe("2020-06-04T19:15:14Z");
          expect(domain.updated_at).toBe("2020-06-04T19:15:21Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      const fixture = loadFixture("notfound-domain.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1385/domains/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.domains.getDomain(accountId, "0").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.data.message).toBe("Domain `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#createDomain", () => {
    const accountId = 1385;
    const attributes = { name: "example-alpha.com" };
    const fixture = loadFixture("createDomain/created.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1385/domains", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createDomain(accountId, attributes);

      nock.isDone();
      done();
    });

    it("produces a domain", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1385/domains")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createDomain(accountId, attributes).then(
        (response) => {
          const domain = response.data;
          expect(domain.id).toBe(181985);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#deleteDomain", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("deleteDomain/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.deleteDomain(accountId, domainId).then(
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
