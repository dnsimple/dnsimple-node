"use strict";

const testUtils = require("../testUtils");
const dnsimple = require("../../lib/dnsimple")({
  accessToken: testUtils.getAccessToken(),
});

const expect = require("chai").expect;
const nock = require("nock");

describe("registrar auto renewal", () => {
  const accountId = "1010";
  const domainId = "example.com";

  describe("#enableDomainAutoRenewal", () => {
    const fixture = testUtils.fixture("enableDomainAutoRenewal/success.http");

    it("produces an empty result", (done) => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId).then(
        (response) => {
          expect(response).to.eql({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      it("results in an error", (done) => {
        const fixture = testUtils.fixture("notfound-domain.http");

        nock("https://api.dnsimple.com")
          .put("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId).then(
          (response) => {
            done("Expected error but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });

  describe("#disableDomainAutoRenewal", () => {
    const fixture = testUtils.fixture("disableDomainAutoRenewal/success.http");

    it("produces an empty result", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId).then(
        (response) => {
          expect(response).to.eql({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      it("results in an error", (done) => {
        const fixture = testUtils.fixture("notfound-domain.http");

        nock("https://api.dnsimple.com")
          .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId).then(
          (response) => {
            done("Expected error but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });
});
