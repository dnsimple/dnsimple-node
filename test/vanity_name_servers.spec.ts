import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("vanity name servers", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableVanityNameServers", () => {
    const fixture = loadFixture("enableVanityNameServers/success.http");

    it("produces a list of name servers", (done) => {
      nock("https://api.dnsimple.com")
        .put("/v2/1010/vanity/example.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.vanityNameServers
        .enableVanityNameServers(accountId, domainId)
        .then(
          (response) => {
            const vanityNameServers = response.data;
            expect(vanityNameServers.length).toBe(4);
            expect(vanityNameServers[0].id).toBe(1);
            expect(vanityNameServers[0].ipv4).toBe("127.0.0.1");
            expect(vanityNameServers[0].ipv6).toBe("::1");
            expect(vanityNameServers[0].created_at).toBe(
              "2016-07-14T13:22:17Z"
            );
            expect(vanityNameServers[0].updated_at).toBe(
              "2016-07-14T13:22:17Z"
            );
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#disableVanityNameServers", () => {
    const fixture = loadFixture("disableVanityNameServers/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/vanity/example.com")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.vanityNameServers
        .disableVanityNameServers(accountId, domainId)
        .then(
          (response) => {
            expect(response).toEqual({});
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });
});
