import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#enableDomainDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("enableDnssec/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDomainDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it("produces an response", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDomainDnssec(accountId, domainId).then(
        (response) => {
          const dnssec = response.data;
          expect(dnssec.enabled).to.eq(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#disableDomainDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("disableDnssec/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.disableDomainDnssec(accountId, domainId).then(
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

  describe("#getDomainDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("getDnssec/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDomainDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it("produces an response", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDomainDnssec(accountId, domainId).then(
        (response) => {
          const dnssec = response.data;
          expect(dnssec.enabled).to.eq(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
