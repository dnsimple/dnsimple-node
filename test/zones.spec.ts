import fetchMock from 'fetch-mock';
import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("zones", () => {
  describe("#activateDns", () => {
    const accountId = 1010;

    it("produces a zone", async () => {
      fetchMock.put("https://api.dnsimple.com/v2/1010/zones/example.com/activation", fetchMockResponse("activateZoneService/success.http"));

      const response = await dnsimple.zones.activateDns(accountId, "example.com");

      const zone = response.data;
      expect(zone.id).toBe(1);
      expect(zone.account_id).toBe(1010);
      expect(zone.name).toBe("example.com");
      expect(zone.reverse).toBe(false);
      expect(zone.created_at).toBe("2015-04-23T07:40:03Z");
      expect(zone.updated_at).toBe("2015-04-23T07:40:03Z");
    });
  });

  describe("#deactivateDns", () => {
    const accountId = 1010;

    it("produces a zone", async () => {
      fetchMock.delete("https://api.dnsimple.com/v2/1010/zones/example.com/activation", fetchMockResponse("deactivateZoneService/success.http"));

      const response = await dnsimple.zones.deactivateDns(accountId, "example.com");

      const zone = response.data;
      expect(zone.id).toBe(1);
      expect(zone.account_id).toBe(1010);
      expect(zone.name).toBe("example.com");
      expect(zone.reverse).toBe(false);
      expect(zone.created_at).toBe("2015-04-23T07:40:03Z");
      expect(zone.updated_at).toBe("2015-04-23T07:40:03Z");
    });
  });

  describe("#listZones", () => {
    const accountId = 1010;

    it("supports pagination", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?page=1", fetchMockResponse("listZones/success.http"));

      await dnsimple.zones.listZones(accountId, { page: 1 });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("supports extra request options", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?foo=bar", fetchMockResponse("listZones/success.http"));

      await dnsimple.zones.listZones(accountId, { foo: "bar" });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("supports sorting", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?sort=name%3Aasc", fetchMockResponse("listZones/success.http"));

      await dnsimple.zones.listZones(accountId, { sort: "name:asc" });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("supports filter", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?name_like=example", fetchMockResponse("listZones/success.http"));

      await dnsimple.zones.listZones(accountId, { name_like: "example" });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("produces a zone list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones", fetchMockResponse("listZones/success.http"));

      const response = await dnsimple.zones.listZones(accountId);

      const zones = response.data;
      expect(zones.length).toBe(2);
      expect(zones[0].name).toBe("example-alpha.com");
      expect(zones[0].account_id).toBe(1010);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones", fetchMockResponse("listZones/success.http"));

      const response = await dnsimple.zones.listZones(accountId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listZones.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?page=1", fetchMockResponse("pages-1of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?page=2", fetchMockResponse("pages-2of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/zones?page=3", fetchMockResponse("pages-3of3.http"));

      const items = await dnsimple.zones.listZones.collectAll(accountId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getZone", () => {
    const accountId = 1010;

    it("produces a zone", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example-alpha.com", fetchMockResponse("getZone/success.http"));

      const response = await dnsimple.zones.getZone(accountId, "example-alpha.com");

      const zone = response.data;
      expect(zone.id).toBe(1);
      expect(zone.account_id).toBe(1010);
      expect(zone.name).toBe("example-alpha.com");
      expect(zone.reverse).toBe(false);
      expect(zone.secondary).toBe(false);
      expect(zone.last_transferred_at).toBe(null);
      expect(zone.active).toBe(true);
      expect(zone.created_at).toBe("2015-04-23T07:40:03Z");
      expect(zone.updated_at).toBe("2015-04-23T07:40:03Z");
    });

    describe("when the zone does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com", fetchMockResponse("notfound-zone.http"));

        await expect(dnsimple.zones.getZone(accountId, "example.com")).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#getZoneFile", () => {
    const accountId = 1010;

    it("produces a zone file", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example-alpha.com/file", fetchMockResponse("getZoneFile/success.http"));

      const response = await dnsimple.zones.getZoneFile(accountId, "example-alpha.com");

      expect(response.data).not.toBe(null);
    });

    describe("when the zone file does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/file", fetchMockResponse("notfound-zone.http"));

        await expect(dnsimple.zones.getZoneFile(accountId, "example.com")).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#checkZoneDistribution", () => {
    const accountId = 1010;

    it("returns true when the zone is fully distributed", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example-alpha.com/distribution", fetchMockResponse("checkZoneDistribution/success.http"));

      const response = await dnsimple.zones.checkZoneDistribution(accountId, "example-alpha.com");

      expect(response.data).not.toBe(null);
    });

    describe("when the zone is not fully distributed", () => {
      it("returns false", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/distribution", fetchMockResponse("checkZoneDistribution/failure.http"));

        const response = await dnsimple.zones.checkZoneDistribution(accountId, "example.com");

        expect(response.data.distributed).toBeFalsy();
      });
    });

    describe("returns an error when the server was not able to complete the check", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/distribution", fetchMockResponse("checkZoneDistribution/error.http"));

        await expect(dnsimple.zones.checkZoneDistribution(accountId, "example.com")).rejects.toThrow();
      });
    });

    describe("when the zone does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/distribution", fetchMockResponse("notfound-zone.http"));

        await expect(dnsimple.zones.checkZoneDistribution(accountId, "example.com")).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#checkZoneRecordDistribution", () => {
    const accountId = 1010;
    const recordId = 1;

    it("returns true when the zone record is fully distributed", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example-alpha.com/records/1/distribution", fetchMockResponse("checkZoneRecordDistribution/success.http"));

      const response = await dnsimple.zones.checkZoneRecordDistribution(accountId, "example-alpha.com", recordId);

      expect(response.data).not.toBe(null);
    });

    describe("when the zone record is not fully distributed", () => {
      it("returns false", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/records/1/distribution", fetchMockResponse("checkZoneRecordDistribution/failure.http"));

        const response = await dnsimple.zones.checkZoneRecordDistribution(accountId, "example.com", recordId);

        expect(response.data.distributed).toBeFalsy();
      });
    });

    describe("returns an error when the server was not able to complete the check", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/records/1/distribution", fetchMockResponse("checkZoneRecordDistribution/error.http"));

        await expect(dnsimple.zones.checkZoneRecordDistribution(accountId, "example.com", recordId)).rejects.toThrow();
      });
    });

    describe("when the zone does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/records/1/distribution", fetchMockResponse("notfound-zone.http"));

        await expect(dnsimple.zones.checkZoneRecordDistribution(accountId, "example.com", recordId)).rejects.toThrow(NotFoundError);
      });
    });

    describe("when the zone record does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/zones/example.com/records/1/distribution", fetchMockResponse("notfound-record.http"));

        await expect(dnsimple.zones.checkZoneRecordDistribution(accountId, "example.com", recordId)).rejects.toThrow(NotFoundError);
      });
    });
  });
});
