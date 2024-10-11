import fetchMock from "fetch-mock";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("identity", () => {
  describe("#whoami when authenticated as account", () => {
    it("produces an account", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/whoami",
        fetchMockResponse("whoami/success-account.http")
      );

      const response = await dnsimple.identity.whoami();

      expect(response.data.user).toBe(null);
      const account = response.data.account;
      expect(account.id).toEqual(1);
      expect(account.email).toEqual("example-account@example.com");
    });
  });

  describe("#whoami when authenticated as user", () => {
    it("produces a user", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/whoami",
        fetchMockResponse("whoami/success-user.http")
      );

      const response = await dnsimple.identity.whoami();

      expect(response.data.account).toBe(null);
      const user = response.data.user;
      expect(user.id).toEqual(1);
      expect(user.email).toEqual("example-user@example.com");
    });
  });
});
