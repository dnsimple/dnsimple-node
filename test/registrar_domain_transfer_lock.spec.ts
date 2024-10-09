import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domain transfer lock", () => {
  const accountId = 1010;

  describe("#getDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      nock("https://api.dnsimple.com").get("/v2/1010/registrar/domains/101/transfer_lock").reply(readFixtureAt("getDomainTransferLock/success.http"));

      const response = await dnsimple.registrar.getDomainTransferLock(accountId, "101");

      expect(response.data).toEqual({
        enabled: true,
      });
    });
  });

  describe("#enableDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      nock("https://api.dnsimple.com").post("/v2/1010/registrar/domains/101/transfer_lock").reply(readFixtureAt("enableDomainTransferLock/success.http"));

      const response = await dnsimple.registrar.enableDomainTransferLock(accountId, "101");

      expect(response.data).toEqual({
        enabled: true,
      });
    });
  });

  describe("#disableDomainTransferLock", () => {
    it("produces a transfer lock", async () => {
      nock("https://api.dnsimple.com").delete("/v2/1010/registrar/domains/101/transfer_lock").reply(readFixtureAt("disableDomainTransferLock/success.http"));

      const response = await dnsimple.registrar.disableDomainTransferLock(accountId, "101");

      expect(response.data).toEqual({
        enabled: false,
      });
    });
  });
});
