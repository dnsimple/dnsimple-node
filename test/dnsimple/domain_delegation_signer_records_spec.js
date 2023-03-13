"use strict";

const testUtils = require("../testUtils");
const dnsimple = require("../../lib/dnsimple")({
  accessToken: testUtils.getAccessToken(),
});

const expect = require("chai").expect;
const nock = require("nock");

describe("domains", () => {
  describe("#listDelegationSignerRecords", () => {
    const accountId = "1010";
    const domainId = "example.com";
    const fixture = testUtils.fixture(
      "listDelegationSignerRecords/success.http"
    );

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        page: 1,
      });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        query: { foo: "bar" },
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?sort=from%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        sort: "from:asc",
      });

      nock.isDone();
      done();
    });

    it("produces an delegation signer records list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDelegationSignerRecords(accountId, domainId).then(
        (response) => {
          const dsRecords = response.data;
          expect(dsRecords.length).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listDelegationSignerRecords(accountId, domainId).then(
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

  describe("#allDelegationSignerRecords", () => {
    const accountId = "1010";
    const domainId = "example.com";

    it("produces a complete list", (done) => {
      const fixture1 = testUtils.fixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = testUtils.fixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = testUtils.fixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.domains
        .allDelegationSignerRecords(accountId, domainId)
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

  describe("#getDelegationSignerRecord", () => {
    const accountId = "1010";
    const domainId = "example.com";
    const dsRecordId = 1;
    const fixture = testUtils.fixture("getDelegationSignerRecord/success.http");

    it("produces a delegation signer record", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains
        .getDelegationSignerRecord(accountId, domainId, dsRecordId)
        .then(
          (response) => {
            const dsRecord = response.data;
            expect(dsRecord.id).to.eq(24);
            expect(dsRecord.algorithm).to.eq("8");
            expect(dsRecord.digest).to.eq(
              "C1F6E04A5A61FBF65BF9DC8294C363CF11C89E802D926BDAB79C55D27BEFA94F"
            );
            expect(dsRecord.digest_type).to.eq("2");
            expect(dsRecord.keytag).to.eq("44620");
            expect(dsRecord.public_key).to.eq(null);
            expect(dsRecord.created_at).to.eq("2017-03-03T13:49:58Z");
            expect(dsRecord.updated_at).to.eq("2017-03-03T13:49:58Z");
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the delegation signer record does not exist", () => {
      const fixture = testUtils.fixture("notfound-delegationSignerRecord.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.domains.getDelegationSignerRecord(accountId, domainId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error.description).to.eq("Not found");
            expect(error.message).to.eq(
              "Delegation signer record `0` not found"
            );
            done();
          }
        );
      });
    });
  });

  describe("#createDelegationSignerRecord", () => {
    const accountId = "1010";
    const domainId = "example.com";
    const attributes = { algorithm: "8" };
    const fixture = testUtils.fixture(
      "createDelegationSignerRecord/created.http"
    );

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/ds_records", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createDelegationSignerRecord(
        accountId,
        domainId,
        attributes
      );

      nock.isDone();
      done();
    });

    it("produces a delegation signer record", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/ds_records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains
        .createDelegationSignerRecord(accountId, domainId, attributes)
        .then(
          (response) => {
            const dsRecord = response.data;
            expect(dsRecord.id).to.eq(2);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#deleteDelegationSignerRecord", () => {
    const accountId = "1010";
    const domainId = "example.com";
    const dsRecordId = 1;
    const fixture = testUtils.fixture(
      "deleteDelegationSignerRecord/success.http"
    );

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/ds_records/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains
        .deleteDelegationSignerRecord(accountId, domainId, dsRecordId)
        .then(
          (response) => {
            expect(response).to.eql({});
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });
});
