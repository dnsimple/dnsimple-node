import fetchMock from "fetch-mock";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("domain delegation", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getDomainDelegation", () => {
    it("produces a name server list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/delegation",
        fetchMockResponse("getDomainDelegation/success.http")
      );

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
      fetchMock.put(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/delegation",
        fetchMockResponse("changeDomainDelegation/success.http")
      );

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
      fetchMock.put(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/delegation/vanity",
        fetchMockResponse("changeDomainDelegationToVanity/success.http")
      );

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
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/delegation/vanity",
        fetchMockResponse("changeDomainDelegationFromVanity/success.http")
      );

      const response =
        await dnsimple.registrar.changeDomainDelegationFromVanity(
          accountId,
          domainId
        );

      expect(response).toEqual({});
    });
  });
});
