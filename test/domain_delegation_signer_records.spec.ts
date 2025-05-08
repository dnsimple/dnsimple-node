import fetchMock from "fetch-mock";
import { NotFoundError } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listDelegationSignerRecords", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?page=1",
        responseFromFixture("listDelegationSignerRecords/success.http")
      );

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        page: 1,
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?foo=bar",
        responseFromFixture("listDelegationSignerRecords/success.http")
      );

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        foo: "bar",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?sort=created_at%3Aasc",
        responseFromFixture("listDelegationSignerRecords/success.http")
      );

      await dnsimple.domains.listDelegationSignerRecords(accountId, domainId, {
        sort: "created_at:asc",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces an delegation signer records list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records",
        responseFromFixture("listDelegationSignerRecords/success.http")
      );

      const response = await dnsimple.domains.listDelegationSignerRecords(
        accountId,
        domainId
      );

      expect(response.data.length).toBe(1);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records",
        responseFromFixture("listDelegationSignerRecords/success.http")
      );

      const response = await dnsimple.domains.listDelegationSignerRecords(
        accountId,
        domainId
      );

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listDelegationSignerRecords.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items =
        await dnsimple.domains.listDelegationSignerRecords.collectAll(
          accountId,
          domainId
        );

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
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records/1",
        responseFromFixture("getDelegationSignerRecord/success.http")
      );

      const response = await dnsimple.domains.getDelegationSignerRecord(
        accountId,
        domainId,
        dsRecordId
      );

      const dsRecord = response.data;
      expect(dsRecord.id).toBe(24);
      expect(dsRecord.algorithm).toBe("8");
      expect(dsRecord.digest).toBe(
        "C1F6E04A5A61FBF65BF9DC8294C363CF11C89E802D926BDAB79C55D27BEFA94F"
      );
      expect(dsRecord.digest_type).toBe("2");
      expect(dsRecord.keytag).toBe("44620");
      expect(dsRecord.public_key).toBe(null);
      expect(dsRecord.created_at).toBe("2017-03-03T13:49:58Z");
      expect(dsRecord.updated_at).toBe("2017-03-03T13:49:58Z");
    });

    describe("when the delegation signer record does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records/0",
          responseFromFixture("notfound-delegationSignerRecord.http")
        );

        await expect(
          dnsimple.domains.getDelegationSignerRecord(accountId, domainId, 0)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createDelegationSignerRecord", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { algorithm: "8" };

    it("builds the correct request", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records",
        responseFromFixture("createDelegationSignerRecord/created.http")
      );

      await dnsimple.domains.createDelegationSignerRecord(
        accountId,
        domainId,
        attributes
      );

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(JSON.stringify(attributes));
    });

    it("produces a delegation signer record", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records",
        responseFromFixture("createDelegationSignerRecord/created.http")
      );

      const response = await dnsimple.domains.createDelegationSignerRecord(
        accountId,
        domainId,
        attributes
      );

      expect(response.data.id).toBe(2);
    });
  });

  describe("#deleteDelegationSignerRecord", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const dsRecordId = 1;

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com/ds_records/1",
        responseFromFixture("deleteDelegationSignerRecord/success.http")
      );

      const response = await dnsimple.domains.deleteDelegationSignerRecord(
        accountId,
        domainId,
        dsRecordId
      );

      expect(response).toEqual({});
    });
  });
});
