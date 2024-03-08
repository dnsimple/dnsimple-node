import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("whois privacy", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#getWhoisPrivacy", () => {
    const fixture = loadFixture("getWhoisPrivacy/success.http");

    it("produces a whois privacy", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/whois_privacy")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getWhoisPrivacy(accountId, domainId).then(
        (response) => {
          const whoisPrivacy = response.data;
          expect(whoisPrivacy.id).toBe(1);
          expect(whoisPrivacy.domain_id).toBe(2);
          expect(whoisPrivacy.expires_on).toBe("2017-02-13");
          expect(whoisPrivacy.enabled).toBe(true);
          expect(whoisPrivacy.created_at).toBe("2016-02-13T14:34:50Z");
          expect(whoisPrivacy.updated_at).toBe("2016-02-13T14:34:52Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#enableWhoisPrivacy", () => {
    describe("when whois privacy is already purchased", () => {
      const fixture = loadFixture("enableWhoisPrivacy/success.http");

      it("produces a whois privacy", (done) => {
        nock("https://api.dnsimple.com")
          .put("/v2/1010/registrar/domains/example.com/whois_privacy")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableWhoisPrivacy(accountId, domainId).then(
          (response) => {
            const whoisPrivacy = response.data;
            expect(whoisPrivacy.id).toBe(1);
            expect(whoisPrivacy.domain_id).toBe(2);
            done();
          },
          (error) => {
            done(error);
          }
        );
      });
    });

    describe("when whois privacy is newly purchased", () => {
      const fixture = loadFixture("enableWhoisPrivacy/created.http");

      it("produces a whois privacy", (done) => {
        nock("https://api.dnsimple.com")
          .put("/v2/1010/registrar/domains/example.com/whois_privacy")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.enableWhoisPrivacy(accountId, domainId).then(
          (response) => {
            const whoisPrivacy = response.data;
            expect(whoisPrivacy.id).toBe(1);
            expect(whoisPrivacy.domain_id).toBe(2);
            done();
          },
          (error) => {
            done(error);
          }
        );
      });
    });
  });

  describe("#disableWhoisPrivacy", () => {
    const fixture = loadFixture("disableWhoisPrivacy/success.http");

    it("produces a whois privacy", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/whois_privacy")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.disableWhoisPrivacy(accountId, domainId).then(
        (response) => {
          const whoisPrivacy = response.data;
          expect(whoisPrivacy.id).toBe(1);
          expect(whoisPrivacy.domain_id).toBe(2);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#renewWhoisPrivacy", () => {
    const fixture = loadFixture("renewWhoisPrivacy/success.http");

    it("produces a whois privacy renewal", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/whois_privacy/renewals")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.renewWhoisPrivacy(accountId, domainId).then(
        (response) => {
          const whoisPrivacyRenewal = response.data;
          expect(whoisPrivacyRenewal.id).toBe(1);
          expect(whoisPrivacyRenewal.domain_id).toBe(100);
          expect(whoisPrivacyRenewal.whois_privacy_id).toBe(999);
          expect(whoisPrivacyRenewal.state).toBe("new");
          expect(whoisPrivacyRenewal.enabled).toBe(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
