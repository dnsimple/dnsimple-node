import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#enableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("enableDnssec/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it("produces an response", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.enableDnssec(accountId, domainId).then(
        (response) => {
          const dnssec = response.data;
          expect(dnssec.enabled).toBe(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#disableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("disableDnssec/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.disableDnssec(accountId, domainId).then(
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

  describe("#getDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("getDnssec/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDnssec(accountId, domainId);

      nock.isDone();
      done();
    });

    it("produces an response", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/dnssec")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.getDnssec(accountId, domainId).then(
        (response) => {
          const dnssec = response.data;
          expect(dnssec.enabled).toBe(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
