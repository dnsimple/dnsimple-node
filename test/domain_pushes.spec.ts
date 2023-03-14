import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

const expect = require("chai").expect;
const nock = require("nock");

describe("domains", () => {
  describe("#initiatePush", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { new_account_email: "jim@example.com" };
    const fixture = loadFixture("initiatePush/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/pushes", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes);

      nock.isDone();
      done();
    });

    it("produces a push result", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/pushes")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.initiatePush(accountId, domainId, attributes).then(
        (response) => {
          const push = response.data;
          expect(push.id).to.eq(1);
          expect(push.domain_id).to.eq(100);
          expect(push.contact_id).to.eq(null);
          expect(push.account_id).to.eq(2020);
          expect(push.created_at).to.eq("2016-08-11T10:16:03Z");
          expect(push.updated_at).to.eq("2016-08-11T10:16:03Z");
          expect(push.accepted_at).to.eq(null);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listPushes", () => {
    const accountId = 1010;
    const fixture = loadFixture("listPushes/success.http");

    it("produces an pushes list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/pushes")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listPushes(accountId).then(
        (response) => {
          const pushes = response.data;
          expect(pushes.length).to.eq(2);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#acceptPush", () => {
    const accountId = 1010;
    const pushId = "200";
    const attributes = { contact_id: 1 };
    const fixture = loadFixture("acceptPush/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/pushes/200", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes);

      nock.isDone();
      done();
    });

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/pushes/200")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.acceptPush(accountId, pushId, attributes).then(
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

  describe("#rejectPush", () => {
    const accountId = 1010;
    const pushId = "200";
    const fixture = loadFixture("rejectPush/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/pushes/200")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId);

      nock.isDone();
      done();
    });

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/pushes/200")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.rejectPush(accountId, pushId).then(
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
