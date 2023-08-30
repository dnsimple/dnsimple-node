import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domain transfer lock", () => {
  const accountId = 1010;

  describe("#getDomainTransferLock", () => {
    const fixture = loadFixture("getDomainTransferLock/success.http");

    it("produces a transfer lock", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/101/transfer_lock")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .getDomainTransferLock(accountId, "101")
        .then(
          ({ data }) => {
            expect(data).to.deep.eq({
              enabled: true,
            });
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#enableDomainTransferLock", () => {
    const fixture = loadFixture("enableDomainTransferLock/success.http");

    it("produces a transfer lock", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/101/transfer_lock")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .enableDomainTransferLock(accountId, "101")
        .then(
          ({ data }) => {
            expect(data).to.deep.eq({
              enabled: true,
            });
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#disableDomainTransferLock", () => {
    const fixture = loadFixture("disableDomainTransferLock/success.http");

    it("produces a transfer lock", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/101/transfer_lock")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableDomainTransferLock(accountId, "101").then(
        ({data}) => {
          expect(data).to.deep.eq({
            enabled: false,
          });
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
