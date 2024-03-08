import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("identity", () => {
  describe("#whoami when authenticated as account", () => {
    const fixture = loadFixture("whoami/success-account.http");
    nock("https://api.dnsimple.com")
      .get("/v2/whoami")
      .reply(fixture.statusCode, fixture.body);

    it("produces an account", (done) => {
      dnsimple.identity.whoami().then(
        (response) => {
          expect(response.data.user).toBe(null);
          const account = response.data.account;
          expect(account.id).toEqual(1);
          expect(account.email).toEqual("example-account@example.com");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#whoami when authenticated as user", () => {
    const fixture = loadFixture("whoami/success-user.http");
    nock("https://api.dnsimple.com")
      .get("/v2/whoami")
      .reply(fixture.statusCode, fixture.body);

    it("produces a user", (done) => {
      dnsimple.identity.whoami().then(
        (response) => {
          expect(response.data.account).toBe(null);
          const user = response.data.user;
          expect(user.id).toEqual(1);
          expect(user.email).toEqual("example-user@example.com");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
