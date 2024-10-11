import { createTestClient, fetchMockResponse } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("accounts", () => {
  describe("#listAccounts", () => {
    it("produces an account list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/accounts",
        fetchMockResponse("listAccounts/success-account.http")
      );

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
