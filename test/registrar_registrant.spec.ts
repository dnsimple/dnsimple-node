import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("registrant", () => {
  const accountId = 1010;

  describe("#checkRegistrantChange", () => {
    it("produces a registrant change", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/registrant_changes/check")
        .reply(readFixtureAt("checkRegistrantChange/success.http"));

      const response = await dnsimple.registrar.checkRegistrantChange(
        accountId,
        {
          contact_id: 101,
          domain_id: 101,
        }
      );

      const data = response.data;
      expect(data.domain_id).toBe(101);
      expect(data.contact_id).toBe(101);
      expect(data.extended_attributes).toEqual([]);
      expect(data.registry_owner_change).toBe(true);
    });
  });

  describe("#createRegistrantChange", () => {
    it("produces a registrant change", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/registrant_changes")
        .reply(readFixtureAt("createRegistrantChange/success.http"));

      const response = await dnsimple.registrar.createRegistrantChange(
        accountId,
        {
          contact_id: 101,
          domain_id: 101,
          extended_attributes: {},
        }
      );

      const data = response.data;
      expect(data.id).toBe(101);
      expect(data.account_id).toBe(101);
      expect(data.domain_id).toBe(101);
      expect(data.contact_id).toBe(101);
      expect(data.state).toBe("new");
      expect(data.extended_attributes).toEqual({});
      expect(data.registry_owner_change).toBe(true);
      expect(data.irt_lock_lifted_by).toBe(null);
      expect(data.created_at).toBe("2017-02-03T17:43:22Z");
      expect(data.created_at).toBe("2017-02-03T17:43:22Z");
    });
  });

  describe("#deleteRegistrantChange", () => {
    it("deletes the registrant change", async () => {
      const scope = nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/registrant_changes/101")
        .reply(readFixtureAt("deleteRegistrantChange/success.http"));

      await dnsimple.registrar.deleteRegistrantChange(accountId, 101);

      expect(scope.isDone()).toBeTruthy();
    });
  });

  describe("#getRegistrantChange", () => {
    it("returns the registrant change", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/registrant_changes/101")
        .reply(readFixtureAt("getRegistrantChange/success.http"));

      const response = await dnsimple.registrar.getRegistrantChange(
        accountId,
        101
      );

      expect(response.data).toEqual({
        id: 101,
        account_id: 101,
        domain_id: 101,
        contact_id: 101,
        state: "new",
        extended_attributes: {},
        registry_owner_change: true,
        irt_lock_lifted_by: null,
        created_at: "2017-02-03T17:43:22Z",
        updated_at: "2017-02-03T17:43:22Z",
      });
    });
  });
});
