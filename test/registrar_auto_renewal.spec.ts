import fetchMock from "fetch-mock";
import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("registrar auto renewal", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableDomainAutoRenewal", () => {
    it("produces an empty result", async () => {
      fetchMock.put(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/auto_renewal",
        fetchMockResponse("enableDomainAutoRenewal/success.http")
      );

      const response = await dnsimple.registrar.enableDomainAutoRenewal(
        accountId,
        domainId
      );

      expect(response).toEqual({});
    });

    describe("when the domain does not exist", () => {
      it("results in an error", async () => {
        fetchMock.put(
          "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/auto_renewal",
          fetchMockResponse("notfound-domain.http")
        );

        await expect(
          dnsimple.registrar.enableDomainAutoRenewal(accountId, domainId)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#disableDomainAutoRenewal", () => {
    it("produces an empty result", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/auto_renewal",
        fetchMockResponse("disableDomainAutoRenewal/success.http")
      );

      const response = await dnsimple.registrar.disableDomainAutoRenewal(
        accountId,
        domainId
      );

      expect(response).toEqual({});
    });

    describe("when the domain does not exist", () => {
      it("results in an error", async () => {
        fetchMock.delete(
          "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/auto_renewal",
          fetchMockResponse("notfound-domain.http")
        );

        await expect(
          dnsimple.registrar.disableDomainAutoRenewal(accountId, domainId)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });
});
