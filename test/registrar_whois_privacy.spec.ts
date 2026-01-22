import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("whois privacy", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableWhoisPrivacy", () => {
    describe("when whois privacy is already purchased", () => {
      it("produces a whois privacy", async () => {
        fetchMock.put(
          "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy",
          responseFromFixture("enableWhoisPrivacy/success.http")
        );

        const response = await dnsimple.registrar.enableWhoisPrivacy(
          accountId,
          domainId
        );

        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).toBe(1);
        expect(whoisPrivacy.domain_id).toBe(2);
      });
    });

    describe("when whois privacy is newly purchased", () => {
      it("produces a whois privacy", async () => {
        fetchMock.put(
          "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy",
          responseFromFixture("enableWhoisPrivacy/created.http")
        );

        const response = await dnsimple.registrar.enableWhoisPrivacy(
          accountId,
          domainId
        );

        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).toBe(1);
        expect(whoisPrivacy.domain_id).toBe(2);
      });
    });
  });

  describe("#disableWhoisPrivacy", () => {
    it("produces a whois privacy", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy",
        responseFromFixture("disableWhoisPrivacy/success.http")
      );

      const response = await dnsimple.registrar.disableWhoisPrivacy(
        accountId,
        domainId
      );

      const whoisPrivacy = response.data;
      expect(whoisPrivacy.id).toBe(1);
      expect(whoisPrivacy.domain_id).toBe(2);
    });
  });
});
