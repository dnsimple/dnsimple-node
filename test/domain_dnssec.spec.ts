import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#enableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com").post("/v2/1010/domains/example.com/dnssec").reply(readFixtureAt("enableDnssec/success.http"));

      await dnsimple.domains.enableDnssec(accountId, domainId);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces an response", async () => {
      nock("https://api.dnsimple.com").post("/v2/1010/domains/example.com/dnssec").reply(readFixtureAt("enableDnssec/success.http"));

      const response = await dnsimple.domains.enableDnssec(accountId, domainId);

      expect(response.data.enabled).toBe(true);
    });
  });

  describe("#disableDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com").delete("/v2/1010/domains/example.com/dnssec").reply(readFixtureAt("disableDnssec/success.http"));

      const response = await dnsimple.domains.disableDnssec(accountId, domainId);

      expect(response).toEqual({});
    });
  });

  describe("#getDnssec", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com").get("/v2/1010/domains/example.com/dnssec").reply(readFixtureAt("getDnssec/success.http"));

      await dnsimple.domains.getDnssec(accountId, domainId);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces an response", async () => {
      nock("https://api.dnsimple.com").get("/v2/1010/domains/example.com/dnssec").reply(readFixtureAt("getDnssec/success.http"));

      const response = await dnsimple.domains.getDnssec(accountId, domainId);

      expect(response.data.enabled).toBe(true);
    });
  });
});
