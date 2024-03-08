import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("zones", () => {
  describe("#activateDns", () => {
    const accountId = 1010;
    const fixture = loadFixture("activateZoneService/success.http");

    it("produces a zone", (done) => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/zones/example.com/activation")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.activateDns(accountId, "example.com").then(
        (response) => {
          const zone = response.data;
          expect(zone.id).toBe(1);
          expect(zone.account_id).toBe(1010);
          expect(zone.name).toBe("example.com");
          expect(zone.reverse).toBe(false);
          expect(zone.created_at).toBe("2015-04-23T07:40:03Z");
          expect(zone.updated_at).toBe("2015-04-23T07:40:03Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#deactivateDns", () => {
    const accountId = 1010;
    const fixture = loadFixture("deactivateZoneService/success.http");

    it("produces a zone", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/zones/example.com/activation")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.deactivateDns(accountId, "example.com").then(
        (response) => {
          const zone = response.data;
          expect(zone.id).toBe(1);
          expect(zone.account_id).toBe(1010);
          expect(zone.name).toBe("example.com");
          expect(zone.reverse).toBe(false);
          expect(zone.created_at).toBe("2015-04-23T07:40:03Z");
          expect(zone.updated_at).toBe("2015-04-23T07:40:03Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listZones", () => {
    const accountId = 1010;
    const fixture = loadFixture("listZones/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { foo: "bar" });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?sort=name%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { sort: "name:asc" });

      nock.isDone();
      done();
    });

    it("supports filter", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?name_like=example")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId, { name_like: "example" });

      nock.isDone();
      done();
    });

    it("produces a zone list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(
        (response) => {
          const zones = response.data;
          expect(zones.length).toBe(2);
          expect(zones[0].name).toBe("example-alpha.com");
          expect(zones[0].account_id).toBe(1010);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.listZones(accountId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).not.toBe(null);
          expect(pagination.current_page).toBe(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listZones.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.zones.listZones
        .collectAll(accountId)
        .then(
          (items) => {
            expect(items.length).toBe(5);
            expect(items[0].id).toBe(1);
            expect(items[4].id).toBe(5);
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

  describe("#getZone", () => {
    const accountId = 1010;
    const fixture = loadFixture("getZone/success.http");

    it("produces a zone", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example-alpha.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZone(accountId, "example-alpha.com").then(
        (response) => {
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
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the zone does not exist", () => {
      const fixture = loadFixture("notfound-zone.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.getZone(accountId, "example.com").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.data.message).toBe("Zone `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#getZoneFile", () => {
    const accountId = 1010;
    const fixture = loadFixture("getZoneFile/success.http");

    it("produces a zone file", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example-alpha.com/file")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.getZoneFile(accountId, "example-alpha.com").then(
        (response) => {
          const zone = response.data;
          expect(zone).not.toBe(null);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the zone file does not exist", () => {
      const fixture = loadFixture("notfound-zone.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/file")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.getZoneFile(accountId, "example.com").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });

  describe("#checkZoneDistribution", () => {
    const accountId = 1010;
    const fixture = loadFixture("checkZoneDistribution/success.http");

    it("returns true when the zone is fully distributed", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example-alpha.com/distribution")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones.checkZoneDistribution(accountId, "example-alpha.com").then(
        (response) => {
          const zone = response.data;
          expect(zone).not.toBe(null);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("returns false when the zone is not fully distributed", () => {
      const fixture = loadFixture("checkZoneDistribution/failure.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.checkZoneDistribution(accountId, "example.com").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).not.toBe(null);
            done();
          }
        );
      });
    });

    describe("returns an error when the server was not able to complete the check", () => {
      const fixture = loadFixture("checkZoneDistribution/error.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.checkZoneDistribution(accountId, "example.com").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).not.toBe(null);
            done();
          }
        );
      });
    });

    describe("when the zone does not exist", () => {
      const fixture = loadFixture("notfound-zone.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones.checkZoneDistribution(accountId, "example.com").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });

  describe("#checkZoneRecordDistribution", () => {
    const accountId = 1010;
    const recordId = 1;
    const fixture = loadFixture("checkZoneRecordDistribution/success.http");

    it("returns true when the zone record is fully distributed", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example-alpha.com/records/1/distribution")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.zones
        .checkZoneRecordDistribution(accountId, "example-alpha.com", recordId)
        .then(
          (response) => {
            const zone = response.data;
            expect(zone).not.toBe(null);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("returns false when the zone record is not fully distributed", () => {
      const fixture = loadFixture("checkZoneRecordDistribution/failure.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/1/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones
          .checkZoneRecordDistribution(accountId, "example.com", recordId)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).not.toBe(null);
              done();
            }
          );
      });
    });

    describe("returns an error when the server was not able to complete the check", () => {
      const fixture = loadFixture("checkZoneRecordDistribution/error.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/1/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones
          .checkZoneRecordDistribution(accountId, "example.com", recordId)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).not.toBe(null);
              done();
            }
          );
      });
    });

    describe("when the zone does not exist", () => {
      const fixture = loadFixture("notfound-zone.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/1/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones
          .checkZoneRecordDistribution(accountId, "example.com", recordId)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).toBeInstanceOf(NotFoundError);
              done();
            }
          );
      });
    });

    describe("when the zone record does not exist", () => {
      const fixture = loadFixture("notfound-record.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/zones/example.com/records/1/distribution")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.zones
          .checkZoneRecordDistribution(accountId, "example.com", recordId)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).toBeInstanceOf(NotFoundError);
              done();
            }
          );
      });
    });
  });
});
