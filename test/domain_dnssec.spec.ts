import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#enableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("builds the correct request", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/dnssec",
        responseFromFixture("enableDnssec/success.http")
      );

      await dnsimple.domains.enableDnssec(accountId, domainId);

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces an response", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/dnssec",
        responseFromFixture("enableDnssec/success.http")
      );

      const response = await dnsimple.domains.enableDnssec(accountId, domainId);

      expect(response.data.enabled).toBe(true);
    });
  });

  describe("#disableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com/dnssec",
        responseFromFixture("disableDnssec/success.http")
      );

      const response = await dnsimple.domains.disableDnssec(
        accountId,
        domainId
      );

      expect(response).toEqual({ rateLimit: expect.any(Object) });
    });
  });

  describe("#getDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("builds the correct request", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/dnssec",
        responseFromFixture("getDnssec/success.http")
      );

      await dnsimple.domains.getDnssec(accountId, domainId);

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces an response", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/dnssec",
        responseFromFixture("getDnssec/success.http")
      );

      const response = await dnsimple.domains.getDnssec(accountId, domainId);

      expect(response.data.enabled).toBe(true);
    });
  });
});
