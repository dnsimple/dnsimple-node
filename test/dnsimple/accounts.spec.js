"use strict";

const testUtils = require("../testUtils");
const dnsimple = require("../../lib/dnsimple")({
  accessToken: testUtils.getAccessToken(),
});

const expect = require("chai").expect;
const nock = require("nock");

describe("accounts", () => {
  describe("#listAccounts", () => {
    const fixture = testUtils.fixture("listAccounts/success-account.http");

    it("produces an account list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/accounts")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.accounts.listAccounts().then(
        (response) => {
          const accounts = response.data;
          expect(accounts.length).to.eq(1);
          expect(accounts[0].id).to.eq(123);
          expect(accounts[0].email).to.eq("john@example.com");
          expect(accounts[0].plan_identifier).to.eq("dnsimple-personal");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
