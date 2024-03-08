import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("registrar auto renewal", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableDomainAutoRenewal", () => {
    const fixture = loadFixture("enableDomainAutoRenewal/success.http");

    it("produces an empty result", (done) => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId).then(
        (response) => {
          expect(response).toEqual({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      it("results in an error", (done) => {
        const fixture = loadFixture("notfound-domain.http");

        nock("https://api.dnsimple.com")
          .put("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId).then(
          (response) => {
            done("Expected error but future resolved");
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });

  describe("#disableDomainAutoRenewal", () => {
    const fixture = loadFixture("disableDomainAutoRenewal/success.http");

    it("produces an empty result", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId).then(
        (response) => {
          expect(response).toEqual({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain does not exist", () => {
      it("results in an error", (done) => {
        const fixture = loadFixture("notfound-domain.http");

        nock("https://api.dnsimple.com")
          .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId).then(
          (response) => {
            done("Expected error but future resolved");
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });
});
