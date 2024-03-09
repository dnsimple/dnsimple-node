import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("zone records", () => {
  describe("#listZoneRecords", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=1")
        .reply(readFixtureAt("listZoneRecords/success.http"));

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?foo=bar")
        .reply(readFixtureAt("listZoneRecords/success.http"));

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?sort=name%3Aasc")
        .reply(readFixtureAt("listZoneRecords/success.http"));

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { sort: "name:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports filter", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?name_like=example")
        .reply(readFixtureAt("listZoneRecords/success.http"));

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { name_like: "example" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a record list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records")
        .reply(readFixtureAt("listZoneRecords/success.http"));

      const response = await dnsimple.zones.listZoneRecords(accountId, zoneId);

      const records = response.data;
      expect(records.length).toBe(5);
      expect(records[0].id).toBe(1);
      expect(records[0].zone_id).toBe(zoneId);
      expect(records[0].name).toBe("");
      expect(records[0].content).toBe(
        "ns1.dnsimple.com admin.dnsimple.com 1458642070 86400 7200 604800 300",
      );
      expect(records[0].ttl).toBe(3600);
      expect(records[0].priority).toBe(null);
      expect(records[0].type).toBe("SOA");
      expect(records[0].system_record).toBe(true);
      expect(records[0].created_at).toBe("2016-03-22T10:20:53Z");
      expect(records[0].updated_at).toBe("2016-10-05T09:26:38Z");
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get(`/v2/1010/zones/${zoneId}/records`)
        .reply(readFixtureAt("listZoneRecords/success.http"));

      const response = await dnsimple.zones.listZoneRecords(accountId, zoneId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listZoneRecords.collectAll", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("produces a complete list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=1")
        .reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=2")
        .reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records?page=3")
        .reply(readFixtureAt("pages-3of3.http"));

      const items = await dnsimple.zones.listZoneRecords.collectAll(accountId, zoneId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("produces a record", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/64784")
        .reply(readFixtureAt("getZoneRecord/success.http"));

      const response = await dnsimple.zones.getZoneRecord(accountId, zoneId, 64784);

      const record = response.data;
      expect(record.id).toBe(5);
      expect(record.regions.length).toBe(2);
      expect(record.regions[0]).toBe("SV1");
      expect(record.regions[1]).toBe("IAD");
    });

    describe("when the record does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/zones/example.com/records/0")
          .reply(readFixtureAt("notfound-record.http"));

        await expect(dnsimple.zones.getZoneRecord(accountId, zoneId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const attributes = {
      name: "",
      type: "A" as const,
      ttl: 3600,
      content: "1.2.3.4",
    };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/zones/example.com/records", attributes)
        .reply(readFixtureAt("createZoneRecord/created.http"));

      await dnsimple.zones.createZoneRecord(accountId, zoneId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a record", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/zones/example.com/records", attributes)
        .reply(readFixtureAt("createZoneRecord/created.http"));

      const response = await dnsimple.zones.createZoneRecord(accountId, zoneId, attributes);

      expect(response.data.id).toBe(1);
    });
  });

  describe("#updateZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const recordId = 64784;
    const attributes = { content: "127.0.0.1" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .patch("/v2/1010/zones/example.com/records/" + recordId, attributes)
        .reply(readFixtureAt("updateZoneRecord/success.http"));

      await dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a record", async () => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/zones/example.com/records/" + recordId, attributes)
        .reply(readFixtureAt("updateZoneRecord/success.http"));

      const response = await dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes);

      expect(response.data.id).toEqual(5);
    });

    describe("when the record does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .patch("/v2/1010/zones/example.com/records/" + recordId, attributes)
          .reply(readFixtureAt("notfound-record.http"));

        await expect(dnsimple.zones.updateZoneRecord(accountId, zoneId, recordId, attributes)).rejects.toThrow(NotFoundError);
      });
    });

    describe("#deleteZoneRecord", () => {
      const accountId = 1010;
      const zoneId = "example.com";
      const recordId = 64784;

      it("builds the correct request", async () => {
        const scope = nock("https://api.dnsimple.com")
          .delete("/v2/1010/zones/example.com/records/" + recordId)
          .reply(readFixtureAt("deleteZoneRecord/success.http"));

        await dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId);

        expect(scope.isDone()).toBeTruthy();
      });

      it("produces nothing", async () => {
        nock("https://api.dnsimple.com")
          .delete("/v2/1010/zones/example.com/records/" + recordId)
          .reply(readFixtureAt("deleteZoneRecord/success.http"));

        const response = await dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId);

        expect(response).toEqual({});
      });

      describe("when the record does not exist", () => {
        it("produces an error", async () => {
          nock("https://api.dnsimple.com")
            .delete("/v2/1010/zones/example.com/records/" + recordId)
            .reply(readFixtureAt("notfound-record.http"));

          await expect(dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId)).rejects.toThrow(NotFoundError);
        });
      });
    });
  });
});
