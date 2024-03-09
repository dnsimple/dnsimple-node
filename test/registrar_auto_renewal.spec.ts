import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("registrar auto renewal", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableDomainAutoRenewal", () => {
    it("produces an empty result", async () => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(readFixtureAt("enableDomainAutoRenewal/success.http"));

      const response = await dnsimple.registrar.enableDomainAutoRenewal(
        accountId,
        domainId
      );

      expect(response).toEqual({});
    });

    describe("when the domain does not exist", () => {
      it("results in an error", async () => {
        nock("https://api.dnsimple.com")
          .put("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(readFixtureAt("notfound-domain.http"));

        await expect(
          dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#disableDomainAutoRenewal", () => {
    it("produces an empty result", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
        .reply(readFixtureAt("disableDomainAutoRenewal/success.http"));

      const response = await dnsimple.registrar.disableDomainAutoRenewal(
        accountId,
        domainId
      );

      expect(response).toEqual({});
    });

    describe("when the domain does not exist", () => {
      it("results in an error", async () => {
        nock("https://api.dnsimple.com")
          .delete("/v2/1010/registrar/domains/example.com/auto_renewal")
          .reply(readFixtureAt("notfound-domain.http"));

        await expect(
          dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });
});
