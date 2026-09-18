import fetchMock from "fetch-mock";
import { ClientError, NotFoundError } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("zone records", () => {
  describe("#listZoneRecords", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?page=1",
        responseFromFixture("listZoneRecords/success.http")
      );

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { page: 1 });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?foo=bar",
        responseFromFixture("listZoneRecords/success.http")
      );

      await dnsimple.zones.listZoneRecords(accountId, zoneId, { foo: "bar" });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?sort=name%3Aasc",
        responseFromFixture("listZoneRecords/success.http")
      );

      await dnsimple.zones.listZoneRecords(accountId, zoneId, {
        sort: "name:asc",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports filter", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?name_like=example",
        responseFromFixture("listZoneRecords/success.http")
      );

      await dnsimple.zones.listZoneRecords(accountId, zoneId, {
        name_like: "example",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces a record list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records",
        responseFromFixture("listZoneRecords/success.http")
      );

      const response = await dnsimple.zones.listZoneRecords(accountId, zoneId);

      const records = response.data;
      expect(records.length).toBe(5);
      expect(records[0].id).toBe(1);
      expect(records[0].zone_id).toBe(zoneId);
      expect(records[0].name).toBe("");
      expect(records[0].content).toBe(
        "ns1.dnsimple.com admin.dnsimple.com 1458642070 86400 7200 604800 300"
      );
      expect(records[0].ttl).toBe(3600);
      expect(records[0].priority).toBe(null);
      expect(records[0].type).toBe("SOA");
      expect(records[0].system_record).toBe(true);
      expect(records[0].created_at).toBe("2016-03-22T10:20:53Z");
      expect(records[0].updated_at).toBe("2016-10-05T09:26:38Z");
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        `https://api.dnsimple.com/v2/1010/zones/${zoneId}/records`,
        responseFromFixture("listZoneRecords/success.http")
      );

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
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items = await dnsimple.zones.listZoneRecords.collectAll(
        accountId,
        zoneId
      );

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";

    it("produces a record", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records/64784",
        responseFromFixture("getZoneRecord/success.http")
      );

      const response = await dnsimple.zones.getZoneRecord(
        accountId,
        zoneId,
        64784
      );

      const record = response.data;
      expect(record.id).toBe(5);
      expect(record.regions.length).toBe(2);
      expect(record.regions[0]).toBe("SV1");
      expect(record.regions[1]).toBe("IAD");
    });

    describe("when the record does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/zones/example.com/records/0",
          responseFromFixture("notfound-record.http")
        );

        await expect(
          dnsimple.zones.getZoneRecord(accountId, zoneId, 0)
        ).rejects.toThrow(NotFoundError);
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
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records",
        responseFromFixture("createZoneRecord/created.http")
      );

      await dnsimple.zones.createZoneRecord(accountId, zoneId, attributes);

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(
        JSON.stringify(attributes)
      );
    });

    it("produces a record", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records",
        responseFromFixture("createZoneRecord/created.http")
      );

      const response = await dnsimple.zones.createZoneRecord(
        accountId,
        zoneId,
        attributes
      );

      expect(response.data.id).toBe(1);
    });
  });

  describe("#updateZoneRecord", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const recordId = 64784;
    const attributes = { content: "127.0.0.1" };

    it("builds the correct request", async () => {
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
          recordId,
        responseFromFixture("updateZoneRecord/success.http")
      );

      await dnsimple.zones.updateZoneRecord(
        accountId,
        zoneId,
        recordId,
        attributes
      );

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(
        JSON.stringify(attributes)
      );
    });

    it("produces a record", async () => {
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
          recordId,
        responseFromFixture("updateZoneRecord/success.http")
      );

      const response = await dnsimple.zones.updateZoneRecord(
        accountId,
        zoneId,
        recordId,
        attributes
      );

      expect(response.data.id).toEqual(5);
    });

    describe("when the record does not exist", () => {
      it("produces an error", async () => {
        fetchMock.patch(
          "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
            recordId,
          responseFromFixture("notfound-record.http")
        );

        await expect(
          dnsimple.zones.updateZoneRecord(
            accountId,
            zoneId,
            recordId,
            attributes
          )
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("#deleteZoneRecord", () => {
      const accountId = 1010;
      const zoneId = "example.com";
      const recordId = 64784;

      it("builds the correct request", async () => {
        fetchMock.delete(
          "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
            recordId,
          responseFromFixture("deleteZoneRecord/success.http")
        );

        await dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId);

        expect(fetchMock.callHistory.called()).toBe(true);
      });

      it("produces nothing", async () => {
        fetchMock.delete(
          "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
            recordId,
          responseFromFixture("deleteZoneRecord/success.http")
        );

        const response = await dnsimple.zones.deleteZoneRecord(
          accountId,
          zoneId,
          recordId
        );

        expect(response).toEqual({ rateLimit: expect.any(Object) });
      });

      describe("when the record does not exist", () => {
        it("produces an error", async () => {
          fetchMock.delete(
            "https://api.dnsimple.com/v2/1010/zones/example.com/records/" +
              recordId,
            responseFromFixture("notfound-record.http")
          );

          await expect(
            dnsimple.zones.deleteZoneRecord(accountId, zoneId, recordId)
          ).rejects.toThrow(NotFoundError);
        });
      });
    });
  });

  describe("#batchChangeZoneRecords", () => {
    const accountId = 1010;
    const zoneId = "example.com";
    const attributes = {
      creates: [
        { name: "ab", type: "A", content: "3.2.3.4" },
        { name: "ab", type: "A", content: "4.2.3.4" },
      ],
      updates: [
        { id: 67622534, content: "3.2.3.40" },
        { id: 67622537, content: "5.2.3.40" },
      ],
      deletes: [{ id: 67622509 }, { id: 67622527 }],
    };

    it("builds the correct request", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/zones/example.com/batch",
        responseFromFixture("batchChangeZoneRecords/success.http")
      );

      await dnsimple.zones.batchChangeZoneRecords(
        accountId,
        zoneId,
        attributes
      );

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(
        JSON.stringify(attributes)
      );
    });

    it("produces the changed records", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/zones/example.com/batch",
        responseFromFixture("batchChangeZoneRecords/success.http")
      );

      const response = await dnsimple.zones.batchChangeZoneRecords(
        accountId,
        zoneId,
        attributes
      );

      const { creates, updates, deletes } = response.data;
      expect(creates.length).toBe(2);
      expect(creates[0].id).toBe(67623409);
      expect(creates[0].zone_id).toBe(zoneId);
      expect(creates[0].name).toBe("ab");
      expect(creates[0].content).toBe("3.2.3.4");
      expect(creates[0].ttl).toBe(3600);
      expect(creates[0].type).toBe("A");
      expect(creates[0].regions).toEqual(["global"]);
      expect(creates[1].id).toBe(67623410);
      expect(updates.length).toBe(2);
      expect(updates[0].id).toBe(67622534);
      expect(updates[0].content).toBe("3.2.3.40");
      expect(updates[1].id).toBe(67622537);
      expect(deletes).toEqual([{ id: 67622509 }, { id: 67622527 }]);
    });

    describe("when the validation fails", () => {
      it("produces an error", async () => {
        fetchMock.post(
          "https://api.dnsimple.com/v2/1010/zones/example.com/batch",
          responseFromFixture(
            "batchChangeZoneRecords/error_400_create_validation_failed.http"
          )
        );

        const error = await dnsimple.zones
          .batchChangeZoneRecords(accountId, zoneId, {
            creates: [{ name: "ab", type: "XYZ", content: "3.2.3.4" }],
          })
          .catch((e) => e);

        expect(error).toBeInstanceOf(ClientError);
        const clientError = error as ClientError;
        expect(clientError.status).toBe(400);
        expect(clientError.data.message).toBe("Validation failed");
        expect(clientError.attributeErrors().creates[0]).toEqual({
          index: 0,
          message: "Validation failed",
          errors: { record_type: ["unsupported"] },
        });
      });
    });
  });
});
