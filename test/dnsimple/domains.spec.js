"use strict";

const testUtils = require("../testUtils");
const dnsimple = require("../../lib/dnsimple")({
  accessToken: testUtils.getAccessToken(),
});

const expect = require("chai").expect;
const nock = require("nock");

describe("domains", () => {
  describe("#listDomains", () => {
    const accountId = "1010";
    const fixture = testUtils.fixture("listDomains/success.http");

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

      dnsimple.domains.listDomains(accountId, { query: { foo: "bar" } });

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
        filter: { name_like: "example" },
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
          expect(domains.length).to.eq(2);
          expect(domains[0].name).to.eq("example-alpha.com");
          expect(domains[0].account_id).to.eq(1385);
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

  describe("#allDomains", () => {
    const accountId = "1010";

    it("produces a complete list", (done) => {
      const fixture1 = testUtils.fixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.domains
        .allDomains(accountId)
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

  describe("#getDomain", () => {
    const accountId = "1385";
    const domainId = "example-alpha.com";
    const fixture = testUtils.fixture("getDomain/success.http");

    it("produces a domain", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1385/domains/example-alpha.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDomain(accountId, domainId).then(
        (response) => {
          const domain = response.data;
          expect(domain.id).to.eq(181984);
          expect(domain.account_id).to.eq(1385);
          expect(domain.registrant_id).to.eq(2715);
          expect(domain.name).to.eq("example-alpha.com");
          expect(domain.state).to.eq("registered");
          expect(domain.auto_renew).to.eq(false);
          expect(domain.private_whois).to.eq(false);
          expect(domain.expires_on).to.eq("2021-06-05");
          expect(domain.expires_at).to.eq("2021-06-05T02:15:00Z");
          expect(domain.created_at).to.eq("2020-06-04T19:15:14Z");
          expect(domain.updated_at).to.eq("2020-06-04T19:15:21Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      const fixture = testUtils.fixture("notfound-domain.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1385/domains/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.domains.getDomain(accountId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error.description).to.eq("Not found");
            expect(error.message).to.eq("Domain `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#createDomain", () => {
    const accountId = "1385";
    const attributes = { name: "example-alpha.com" };
    const fixture = testUtils.fixture("createDomain/created.http");

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
          expect(domain.id).to.eq(181985);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#deleteDomain", () => {
    const accountId = "1010";
    const domainId = "example.com";
    const fixture = testUtils.fixture("deleteDomain/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.deleteDomain(accountId, domainId).then(
        (response) => {
          expect(response).to.eql({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
