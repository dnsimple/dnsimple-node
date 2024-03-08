import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("registrant", () => {
  const accountId = 1010;

  describe("#checkRegistrantChange", () => {
    const fixture = loadFixture("checkRegistrantChange/success.http");

    it("produces a registrant change", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/registrant_changes/check")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .checkRegistrantChange(accountId, {
          contact_id: 101,
          domain_id: 101,
        })
        .then(
          ({ data }) => {
            expect(data.domain_id).toBe(101);
            expect(data.contact_id).toBe(101);
            expect(data.extended_attributes).toEqual([]);
            expect(data.registry_owner_change).toBe(true);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#createRegistrantChange", () => {
    const fixture = loadFixture("createRegistrantChange/success.http");

    it("produces a registrant change", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/registrant_changes")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar
        .createRegistrantChange(accountId, {
          contact_id: 101,
          domain_id: 101,
          extended_attributes: {},
        })
        .then(
          ({ data }) => {
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
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#deleteRegistrantChange", () => {
    const fixture = loadFixture("deleteRegistrantChange/success.http");

    it("deletes the registrant change", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/registrant_changes/101")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.deleteRegistrantChange(accountId, 101).then(
        () => {
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#getRegistrantChange", () => {
    const fixture = loadFixture("getRegistrantChange/success.http");

    it("returns the registrant change", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/registrant_changes/101")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getRegistrantChange(accountId, 101).then(
        ({ data }) => {
          expect(data).toEqual({
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
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
