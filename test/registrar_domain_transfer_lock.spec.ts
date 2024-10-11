import fetchMock from "fetch-mock";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("domain transfer lock", () => {
  const accountId = 1010;

  describe("#getDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/registrar/domains/101/transfer_lock",
        fetchMockResponse("getDomainTransferLock/success.http")
      );

      const response = await dnsimple.registrar.getDomainTransferLock(
        accountId,
        "101"
      );

      expect(response.data).toEqual({
        enabled: true,
      });
    });
  });

  describe("#enableDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/registrar/domains/101/transfer_lock",
        fetchMockResponse("enableDomainTransferLock/success.http")
      );

      const response = await dnsimple.registrar.enableDomainTransferLock(
        accountId,
        "101"
      );

      expect(response.data).toEqual({
        enabled: true,
      });
    });
  });

  describe("#disableDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/registrar/domains/101/transfer_lock",
        fetchMockResponse("disableDomainTransferLock/success.http")
      );

      const response = await dnsimple.registrar.disableDomainTransferLock(
        accountId,
        "101"
      );

      expect(response.data).toEqual({
        enabled: false,
      });
    });
  });
});
