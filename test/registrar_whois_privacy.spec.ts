import fetchMock from "fetch-mock";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("whois privacy", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getWhoisPrivacy", () => {
    it("produces a whois privacy", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy",
        fetchMockResponse("getWhoisPrivacy/success.http")
      );

      const response = await dnsimple.registrar.getWhoisPrivacy(
        accountId,
        domainId
      );

      const whoisPrivacy = response.data;
      expect(whoisPrivacy.id).toBe(1);
      expect(whoisPrivacy.domain_id).toBe(2);
      expect(whoisPrivacy.expires_on).toBe("2017-02-13");
      expect(whoisPrivacy.enabled).toBe(true);
      expect(whoisPrivacy.created_at).toBe("2016-02-13T14:34:50Z");
      expect(whoisPrivacy.updated_at).toBe("2016-02-13T14:34:52Z");
    });
  });

  describe("#enableWhoisPrivacy", () => {
    describe("when whois privacy is already purchased", () => {
      it("produces a whois privacy", async () => {
        fetchMock.put(
          "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy",
          fetchMockResponse("enableWhoisPrivacy/success.http")
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
          fetchMockResponse("enableWhoisPrivacy/created.http")
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
        fetchMockResponse("disableWhoisPrivacy/success.http")
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

  describe("#renewWhoisPrivacy", () => {
    it("produces a whois privacy renewal", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/registrar/domains/example.com/whois_privacy/renewals",
        fetchMockResponse("renewWhoisPrivacy/success.http")
      );

      const response = await dnsimple.registrar.renewWhoisPrivacy(
        accountId,
        domainId
      );

      const whoisPrivacyRenewal = response.data;
      expect(whoisPrivacyRenewal.id).toBe(1);
      expect(whoisPrivacyRenewal.domain_id).toBe(100);
      expect(whoisPrivacyRenewal.whois_privacy_id).toBe(999);
      expect(whoisPrivacyRenewal.state).toBe("new");
      expect(whoisPrivacyRenewal.enabled).toBe(true);
    });
  });
});
