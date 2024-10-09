import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("whois privacy", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getWhoisPrivacy", () => {
    it("produces a whois privacy", async () => {
      nock("https://api.dnsimple.com").get("/v2/1010/registrar/domains/example.com/whois_privacy").reply(readFixtureAt("getWhoisPrivacy/success.http"));

      const response = await dnsimple.registrar.getWhoisPrivacy(accountId, domainId);

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
        nock("https://api.dnsimple.com").put("/v2/1010/registrar/domains/example.com/whois_privacy").reply(readFixtureAt("enableWhoisPrivacy/success.http"));

        const response = await dnsimple.registrar.enableWhoisPrivacy(accountId, domainId);

        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).toBe(1);
        expect(whoisPrivacy.domain_id).toBe(2);
      });
    });

    describe("when whois privacy is newly purchased", () => {
      it("produces a whois privacy", async () => {
        nock("https://api.dnsimple.com").put("/v2/1010/registrar/domains/example.com/whois_privacy").reply(readFixtureAt("enableWhoisPrivacy/created.http"));

        const response = await dnsimple.registrar.enableWhoisPrivacy(accountId, domainId);

        const whoisPrivacy = response.data;
        expect(whoisPrivacy.id).toBe(1);
        expect(whoisPrivacy.domain_id).toBe(2);
      });
    });
  });

  describe("#disableWhoisPrivacy", () => {
    it("produces a whois privacy", async () => {
      nock("https://api.dnsimple.com").delete("/v2/1010/registrar/domains/example.com/whois_privacy").reply(readFixtureAt("disableWhoisPrivacy/success.http"));

      const response = await dnsimple.registrar.disableWhoisPrivacy(accountId, domainId);

      const whoisPrivacy = response.data;
      expect(whoisPrivacy.id).toBe(1);
      expect(whoisPrivacy.domain_id).toBe(2);
    });
  });

  describe("#renewWhoisPrivacy", () => {
    it("produces a whois privacy renewal", async () => {
      nock("https://api.dnsimple.com").post("/v2/1010/registrar/domains/example.com/whois_privacy/renewals").reply(readFixtureAt("renewWhoisPrivacy/success.http"));

      const response = await dnsimple.registrar.renewWhoisPrivacy(accountId, domainId);

      const whoisPrivacyRenewal = response.data;
      expect(whoisPrivacyRenewal.id).toBe(1);
      expect(whoisPrivacyRenewal.domain_id).toBe(100);
      expect(whoisPrivacyRenewal.whois_privacy_id).toBe(999);
      expect(whoisPrivacyRenewal.state).toBe("new");
      expect(whoisPrivacyRenewal.enabled).toBe(true);
    });
  });
});
