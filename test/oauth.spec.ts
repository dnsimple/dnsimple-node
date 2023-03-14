import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("oauth", () => {
  const clientId = "super-client";
  const clientSecret = "super-secret";
  const code = "super-code";
  const state = "mysecretstate";
  const redirectUri = "https://great-app.com/oauth";

  describe("#exchangeAuthorizationForToken", () => {
    const fixture = loadFixture("oauthAccessToken/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/oauth/access_token", {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth.exchangeAuthorizationForToken(
        code,
        clientId,
        clientSecret,
        { redirectUri, state }
      );

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
        })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.oauth
        .exchangeAuthorizationForToken(code, clientId, clientSecret, {
          redirectUri,
          state,
        })
        .then(
          (response) => {
            expect(response.access_token).to.eq(
              "zKQ7OLqF5N1gylcJweA9WodA000BUNJD"
            );
            expect(response.token_type).to.eq("Bearer");
            expect(response.account_id).to.eq(1);
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

        const options = { state, redirectUri };
        dnsimple.oauth.exchangeAuthorizationForToken(
          code,
          clientId,
          clientSecret,
          options
        );

        nock.isDone();
        done();
      });
    });
  });

  describe("#authorizeUrl", () => {
    it("builds the correct url", () => {
      const authorizeUrl = new URL(
        dnsimple.oauth.authorizeUrl("great-app", { redirectUri, state })
      );
      const expectedUrl = new URL(
        "https://dnsimple.com/oauth/authorize?client_id=great-app&response_type=code"
      );

      expect(authorizeUrl.protocol).to.eq(expectedUrl.protocol);
      expect(authorizeUrl.host).to.eq(expectedUrl.host);
      expect(Object.fromEntries(authorizeUrl.searchParams)).to.deep.equal(
        Object.fromEntries(expectedUrl.searchParams)
      );
    });
  });
});
