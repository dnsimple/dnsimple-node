import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("identity", () => {
  describe("#whoami when authenticated as account", () => {
    it("produces an account", async () => {
      nock("https://api.dnsimple.com").get("/v2/whoami").reply(readFixtureAt("whoami/success-account.http"));

      const response = await dnsimple.identity.whoami();

      expect(response.data.user).toBe(null);
      const account = response.data.account;
      expect(account.id).toEqual(1);
      expect(account.email).toEqual("example-account@example.com");
    });
  });

  describe("#whoami when authenticated as user", () => {
    it("produces a user", async () => {
      nock("https://api.dnsimple.com").get("/v2/whoami").reply(readFixtureAt("whoami/success-user.http"));

      const response = await dnsimple.identity.whoami();

      expect(response.data.account).toBe(null);
      const user = response.data.user;
      expect(user.id).toEqual(1);
      expect(user.email).toEqual("example-user@example.com");
    });
  });
});
