import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("accounts", () => {
  describe("#listAccounts", () => {
    it("produces an account list", async () => {
      nock("https://api.dnsimple.com").get("/v2/accounts").reply(readFixtureAt("listAccounts/success-account.http"));

      const result = await dnsimple.accounts.listAccounts();

      expect(result).toEqual({
        data: [
          {
            id: 123,
            email: "john@example.com",
            plan_identifier: "dnsimple-personal",
            created_at: "2011-09-11T17:15:58Z",
            updated_at: "2016-06-03T15:02:26Z",
          },
        ],
      });
    });
  });
});
