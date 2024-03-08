import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("oauth", () => {
  const clientId = "super-client";
  const clientSecret = "super-secret";
  const code = "super-code";
  const redirectUri = "https://great-app.com/oauth";
  const state = "mysecretstate";

  describe("#exchangeAuthorizationForToken", () => {
    const fixture = loadFixture("oauthAccessToken/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/oauth/access_token", {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          state,
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken({
        code,
        clientId,
        clientSecret,
        redirectUri,
        state,
      });

      nock.isDone();
      done();
    });

    it("returns the oauth token", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/oauth/access_token", {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          state,
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth
        .exchangeAuthorizationForToken({
          code,
          clientId,
          clientSecret,
          redirectUri,
          state,
        })
        .then(
          (response) => {
            expect(response.access_token).toBe(
              "zKQ7OLqF5N1gylcJweA9WodA000BUNJD"
            );
            expect(response.token_type).toBe("Bearer");
            expect(response.account_id).toBe(1);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when state and redirect_uri are provided", () => {
      const state = "super-state";
      const redirectUri = "super-redirect-uri";

      it("builds the correct request", (done) => {
        nock("https://api.dnsimple.com")
          .post("/v2/oauth/access_token", {
            client_id: clientId,
            client_secret: clientSecret,
            code,
            grant_type: "authorization_code",
            state,
            redirect_uri: redirectUri,
          })
          .reply(fixture.statusCode, fixture.body);

        dnsimple.oauth.exchangeAuthorizationForToken({
          code,
          clientId,
          clientSecret,
          state,
          redirectUri,
        });

        nock.isDone();
        done();
      });
    });
  });

  describe("#authorizeUrl", () => {
    it("builds the correct url", () => {
      const authorizeUrl = new URL(
        dnsimple.oauth.authorizeUrl({
          clientId: "great-app",
          redirectUri,
          state,
        })
      );
      const expectedUrl = new URL(
        "https://dnsimple.com/oauth/authorize?client_id=great-app&redirect_uri=https://great-app.com/oauth&response_type=code&state=mysecretstate"
      );

      const searchParamsToObj = (params: URLSearchParams) => {
        const obj: { [name: string]: any } = {};
        params.forEach((val, key) => {
          obj[key] = val;
        });
        return obj;
      };

      expect(authorizeUrl.protocol).toBe(expectedUrl.protocol);
      expect(authorizeUrl.host).toBe(expectedUrl.host);
      expect(searchParamsToObj(authorizeUrl.searchParams)).toEqual(
        searchParamsToObj(expectedUrl.searchParams)
      );
    });
  });
});
