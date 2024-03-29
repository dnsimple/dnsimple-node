import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domain delegation", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getDomainDelegation", () => {
    it("produces a name server list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/delegation")
        .reply(readFixtureAt("getDomainDelegation/success.http"));

      const response = await dnsimple.registrar.getDomainDelegation(
        accountId,
        domainId
      );

      expect(response.data).toEqual([
        "ns1.dnsimple.com",
        "ns2.dnsimple.com",
        "ns3.dnsimple.com",
        "ns4.dnsimple.com",
      ]);
    });
  });

  describe("#changeDomainDelegation", () => {
    const attributes = [
      "ns1.dnsimple.com",
      "ns2.dnsimple.com",
      "ns3.dnsimple.com",
      "ns4.dnsimple.com",
    ];

    it("produces a name server list", async () => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/registrar/domains/example.com/delegation", attributes)
        .reply(readFixtureAt("changeDomainDelegation/success.http"));

      const response = await dnsimple.registrar.changeDomainDelegation(
        accountId,
        domainId,
        attributes
      );

      expect(response.data).toEqual([
        "ns1.dnsimple.com",
        "ns2.dnsimple.com",
        "ns3.dnsimple.com",
        "ns4.dnsimple.com",
      ]);
    });
  });

  describe("#changeDomainDelegationToVanity", () => {
    const attributes = ["ns1.example.com", "ns2.example.com"];

    it("produces a name server list", async () => {
      nock("https://api.dnsimple.com")
        .put(
          "/v2/1010/registrar/domains/example.com/delegation/vanity",
          attributes
        )
        .reply(readFixtureAt("changeDomainDelegationToVanity/success.http"));

      const response = await dnsimple.registrar.changeDomainDelegationToVanity(
        accountId,
        domainId,
        attributes
      );

      expect(response.data.length).toBe(2);
    });
  });

  describe("#changeDomainDelegationFromVanity", () => {
    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/delegation/vanity")
        .reply(readFixtureAt("changeDomainDelegationFromVanity/success.http"));

      const response =
        await dnsimple.registrar.changeDomainDelegationFromVanity(
          accountId,
          domainId
        );

      expect(response).toEqual({});
    });
  });
});
