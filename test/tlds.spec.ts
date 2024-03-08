import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("tlds", () => {
  describe("#listTlds", () => {
    const fixture = loadFixture("listTlds/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.listTlds({ page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.listTlds({ foo: "bar" });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?sort=tld%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.listTlds({ sort: "tld:asc" });

      nock.isDone();
      done();
    });

    it("produces a tld list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.listTlds().then(
        (response) => {
          const tlds = response.data;
          expect(tlds.length).toBe(2);
          expect(tlds[0].tld).toBe("ac");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.listTlds().then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).not.toBe(null);
          expect(pagination.current_page).toBe(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#getTld", () => {
    const fixture = loadFixture("getTld/success.http");

    it("produces a tld", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/tlds/com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.getTld("com").then(
        (response) => {
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
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#getTldExtendedAttributes", () => {
    it("produces a collection of extended attributes", (done) => {
      const fixture = loadFixture("getTldExtendedAttributes/success.http");

      nock("https://api.dnsimple.com")
        .get("/v2/tlds/uk/extended_attributes")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.tlds.getTldExtendedAttributes("uk").then(
        (response) => {
          const extendedAttributes = response.data;
          expect(extendedAttributes.length).toBe(4);
          expect(extendedAttributes[0].name).toBe("uk_legal_type");
          expect(extendedAttributes[0].description).toBe("Legal type of registrant contact");
          expect(extendedAttributes[0].required).toBe(false);
          expect(extendedAttributes[0].options.length).toBe(17);
          expect(extendedAttributes[0].options[0].title).toBe("UK Individual");
          expect(extendedAttributes[0].options[0].value).toBe("IND");
          expect(extendedAttributes[0].options[0].description).toBe("UK Individual (our default value)");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when there are no extended attributes for a TLD", () => {
      const fixture = loadFixture(
        "getTldExtendedAttributes/success-noattributes.http"
      );

      it("returns an empty collection", (done) => {
        nock("https://api.dnsimple.com")
          .get("/v2/tlds/com/extended_attributes")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.tlds.getTldExtendedAttributes("com").then(
          (response) => {
            expect(response.data).toEqual([]);
            done();
          },
          (error) => {
            done(error);
          }
        );
      });
    });
  });
});
