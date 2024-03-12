import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("tlds", () => {
  describe("#listTlds", () => {
    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/tlds?page=1")
        .reply(readFixtureAt("listTlds/success.http"));

      await dnsimple.tlds.listTlds({ page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/tlds?foo=bar")
        .reply(readFixtureAt("listTlds/success.http"));

      await dnsimple.tlds.listTlds({ foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/tlds?sort=tld%3Aasc")
        .reply(readFixtureAt("listTlds/success.http"));

      await dnsimple.tlds.listTlds({ sort: "tld:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a tld list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds")
        .reply(readFixtureAt("listTlds/success.http"));

      const response = await dnsimple.tlds.listTlds();

      const tlds = response.data;
      expect(tlds.length).toBe(2);
      expect(tlds[0].tld).toBe("ac");
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds")
        .reply(readFixtureAt("listTlds/success.http"));

      const response = await dnsimple.tlds.listTlds();

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#getTld", () => {
    it("produces a tld", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds/com")
        .reply(readFixtureAt("getTld/success.http"));

      const response = await dnsimple.tlds.getTld("com");

      const tld = response.data;
      expect(tld.tld).toBe("com");
      expect(tld.tld_type).toBe(1);
      expect(tld.whois_privacy).toBe(true);
      expect(tld.auto_renew_only).toBe(false);
      expect(tld.idn).toBe(true);
      expect(tld.minimum_registration).toBe(1);
      expect(tld.registration_enabled).toBe(true);
      expect(tld.renewal_enabled).toBe(true);
      expect(tld.transfer_enabled).toBe(true);
      expect(tld.dnssec_interface_type).toBe("ds");
    });
  });

  describe("#getTldExtendedAttributes", () => {
    it("produces a collection of extended attributes", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds/uk/extended_attributes")
        .reply(readFixtureAt("getTldExtendedAttributes/success.http"));

      const response = await dnsimple.tlds.getTldExtendedAttributes("uk");

      const extendedAttributes = response.data;
      expect(extendedAttributes.length).toBe(4);
      expect(extendedAttributes[0].name).toBe("uk_legal_type");
      expect(extendedAttributes[0].description).toBe(
        "Legal type of registrant contact"
      );
      expect(extendedAttributes[0].required).toBe(false);
      expect(extendedAttributes[0].options.length).toBe(17);
      expect(extendedAttributes[0].options[0].title).toBe("UK Individual");
      expect(extendedAttributes[0].options[0].value).toBe("IND");
      expect(extendedAttributes[0].options[0].description).toBe(
        "UK Individual (our default value)"
      );
    });

    describe("when there are no extended attributes for a TLD", () => {
      it("returns an empty collection", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/tlds/com/extended_attributes")
          .reply(
            readFixtureAt("getTldExtendedAttributes/success-noattributes.http")
          );

        const response = await dnsimple.tlds.getTldExtendedAttributes("com");

        expect(response.data).toEqual([]);
      });
    });
  });
});
