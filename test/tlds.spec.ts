import { expect } from "chai";
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

      dnsimple.tlds.listTlds({ query: { foo: "bar" } });

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
          expect(tlds.length).to.eq(2);
          expect(tlds[0].tld).to.eq("ac");
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
          expect(pagination).to.not.eq(null);
          expect(pagination.current_page).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#allTlds", () => {
    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/tlds?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.tlds
        .allTlds()
        .then(
          (items) => {
            expect(items.length).to.eq(5);
            expect(items[0].id).to.eq(1);
            expect(items[4].id).to.eq(5);
            done();
          },
          (error) => {
            done(error);
          }
        )
        .catch((error) => {
          done(error);
        });
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
          expect(tld.tld).to.eq("com");
          expect(tld.tld_type).to.eq(1);
          expect(tld.whois_privacy).to.eq(true);
          expect(tld.auto_renew_only).to.eq(false);
          expect(tld.idn).to.eq(true);
          expect(tld.minimum_registration).to.eq(1);
          expect(tld.registration_enabled).to.eq(true);
          expect(tld.renewal_enabled).to.eq(true);
          expect(tld.transfer_enabled).to.eq(true);
          expect(tld.dnssec_interface_type).to.eq("ds");
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
          expect(extendedAttributes.length).to.eq(4);
          expect(extendedAttributes[0].name).to.eq("uk_legal_type");
          expect(extendedAttributes[0].description).to.eq(
            "Legal type of registrant contact"
          );
          expect(extendedAttributes[0].required).to.eq(false);
          expect(extendedAttributes[0].options.length).to.eq(17);
          expect(extendedAttributes[0].options[0].title).to.eq("UK Individual");
          expect(extendedAttributes[0].options[0].value).to.eq("IND");
          expect(extendedAttributes[0].options[0].description).to.eq(
            "UK Individual (our default value)"
          );
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
            expect(response.data).to.eql([]);
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
