import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("accounts", () => {
  describe("#listAccounts", () => {
    const fixture = loadFixture("listAccounts/success-account.http");

    it("produces an account list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/accounts")
        .reply(fixture.statusCode, fixture.body);

      await expect(dnsimple.accounts.listAccounts()).to.eventually.deep.equal({
        data: {
          accounts: [
            {
              id: 123,
              email: "john@example.com",
              plan_identifier: "dnsimple-personal",
            },
          ],
        },
      });
    });
  });
});
