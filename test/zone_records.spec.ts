import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("zone records", () => {
  describe("#listZoneRecords", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const fixture = loadFixture("listZoneRecords/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {
        foo: "bar",
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?sort=name%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, { sort: "name:asc" });

      nock.isDone();
      done();
    });

    it("supports filter", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?name_like=example")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId, {
        name_like: "example",
      });

      nock.isDone();
      done();
    });

    it("produces a record list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId).then(
        (response) => {
          const records = response.data;
          expect(records.length).to.eq(5);
          expect(records[0].id).to.eq(1);
          expect(records[0].zone_id).to.eq(zoneId);
          expect(records[0].name).to.eq("");
          expect(records[0].content).to.eq(
            "ns1.dnsimple.com admin.dnsimple.com 1458642070 86400 7200 604800 300"
          );
          expect(records[0].ttl).to.eq(3600);
          expect(records[0].priority).to.eq(null);
          expect(records[0].type).to.eq("SOA");
          expect(records[0].system_record).to.eq(true);
          expect(records[0].created_at).to.eq("2016-03-22T10:20:53Z");
          expect(records[0].updated_at).to.eq("2016-10-05T09:26:38Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get(`/v2/1010/zones/${zoneId}/records`)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZoneRecords(accountId, zoneId).then(
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

  describe("#listZoneRecords.collectAll", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.zones.listZoneRecords
        .collectAll(accountId, zoneId)
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

  describe("#getZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const fixture = loadFixture("getZoneRecord/success.http");

    it("produces a record", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/64784")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZoneRecord(accountId, zoneId, 64784).then(
        (response) => {
          const record = response.data;
          expect(record.id).to.eq(5);
          expect(record.regions.length).to.eq(2);
          expect(record.regions[0]).to.eq("SV1");
          expect(record.regions[1]).to.eq("IAD");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the record does not exist", () => {
      const fixture = loadFixture("notfound-record.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.getZoneRecord(accountId, zoneId, 0).then(
          (response) => {
            done("Error expected but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error.description).to.eq("Not found");
            expect(error.message).to.eq("Record `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#createZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const attributes = {
      name: "",
      type: "A",
      ttl: 3600,
      content: "1.2.3.4",
    } as any;
    const fixture = loadFixture("createZoneRecord/created.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/zones/example.com/records", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createZoneRecord(accountId, zoneId, attributes);

      nock.isDone();
      done();
    });

    it("produces a record", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/zones/example.com/records", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.createZoneRecord(accountId, zoneId, attributes).then(
        (response) => {
          const record = response.data;
          expect(record.id).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#updateZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const recordId = 64784;
    const attributes = { content: "127.0.0.1" } as any;
    const fixture = loadFixture("updateZoneRecord/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/zones/example.com/records/" + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes);

      nock.isDone();
      done();
    });

    it("produces a record", (done) => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/zones/example.com/records/" + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones
        .updateZoneRecord(accountId, zoneId, recordId, attributes)
        .then(
          (response) => {
            const record = response.data;
            expect(record.id).to.eq(5);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the record does not exist", () => {
      const fixture = loadFixture("notfound-record.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/" + recordId, attributes)
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones
          .updateZoneRecord(accountId, zoneId, recordId, attributes)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).to.not.eq(null);
              done();
            }
          );
      });
    });
  });

  describe("#deleteZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const recordId = 64784;
    const fixture = loadFixture("deleteZoneRecord/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/zones/example.com/records/" + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId);

      nock.isDone();
      done();
    });

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/zones/example.com/records/" + recordId)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId).then(
        (response) => {
          expect(response).to.eql({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the record does not exist", () => {
      it("produces an error", (done) => {
        const fixture = loadFixture("notfound-record.http");
        nock("https://api.dnsimple.com")
          .delete("/v2/1010/zones/example.com/records/" + recordId)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId).then(
          (response) => {
            done("Error expected but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });
});
