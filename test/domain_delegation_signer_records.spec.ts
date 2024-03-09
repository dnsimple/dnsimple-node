import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listDelegationSignerRecords", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=1")
        .reply(readFixtureAt("listDelegationSignerRecords/success.http"));

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?foo=bar")
        .reply(readFixtureAt("listDelegationSignerRecords/success.http"));

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports sorting", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?sort=created_at%3Aasc")
        .reply(readFixtureAt("listDelegationSignerRecords/success.http"));

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, { sort: "created_at:asc" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces an delegation signer records list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records")
        .reply(readFixtureAt("listDelegationSignerRecords/success.http"));

      const response = await dnsimple.domains.listDelegationSignerRecords(accountId, domainId);

      expect(response.data.length).toBe(1);
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records")
        .reply(readFixtureAt("listDelegationSignerRecords/success.http"));

      const response = await dnsimple.domains.listDelegationSignerRecords(accountId, domainId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listDelegationSignerRecords.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=1")
        .reply(readFixtureAt("pages-1of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=2")
        .reply(readFixtureAt("pages-2of3.http"));

      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records?page=3")
        .reply(readFixtureAt("pages-3of3.http"));

      const items = await dnsimple.domains.listDelegationSignerRecords.collectAll(accountId, domainId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getDelegationSignerRecord", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const dsRecordId = 1;

    it("produces a delegation signer record", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/ds_records/1")
        .reply(readFixtureAt("getDelegationSignerRecord/success.http"));

      const response = await dnsimple.domains.getDelegationSignerRecord(accountId, domainId, dsRecordId);

      const dsRecord = response.data;
      expect(dsRecord.id).toBe(24);
      expect(dsRecord.algorithm).toBe("8");
      expect(dsRecord.digest).toBe(
        "C1F6E04A5A61FBF65BF9DC8294C363CF11C89E802D926BDAB79C55D27BEFA94F",
      );
      expect(dsRecord.digest_type).toBe("2");
      expect(dsRecord.keytag).toBe("44620");
      expect(dsRecord.public_key).toBe(null);
      expect(dsRecord.created_at).toBe("2017-03-03T13:49:58Z");
      expect(dsRecord.updated_at).toBe("2017-03-03T13:49:58Z");
    });

    describe("when the delegation signer record does not exist", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/domains/example.com/ds_records/0")
          .reply(readFixtureAt("notfound-delegationSignerRecord.http"));

        await expect(dnsimple.domains.getDelegationSignerRecord(accountId, domainId, 0)).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createDelegationSignerRecord", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { algorithm: "8" };

    it("builds the correct request", async () => {
      const scope = nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/ds_records", attributes)
        .reply(readFixtureAt("createDelegationSignerRecord/created.http"));

      await dnsimple.domains.createDelegationSignerRecord(accountId, domainId, attributes);

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a delegation signer record", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/ds_records")
        .reply(readFixtureAt("createDelegationSignerRecord/created.http"));

      const response = await dnsimple.domains.createDelegationSignerRecord(accountId, domainId, attributes);

      expect(response.data.id).toBe(2);
    });
  });

  describe("#deleteDelegationSignerRecord", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const dsRecordId = 1;

    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/ds_records/1")
        .reply(readFixtureAt("deleteDelegationSignerRecord/success.http"));

      const response = await dnsimple.domains.deleteDelegationSignerRecord(accountId, domainId, dsRecordId);

      expect(response).toEqual({});
    });
  });
});
