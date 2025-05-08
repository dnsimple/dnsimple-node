import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("oauth", () => {
  const clientId = "super-client";
  const clientSecret = "super-secret";
  const code = "super-code";
  const redirectUri = "https://great-app.com/oauth";
  const state = "mysecretstate";

  describe("#exchangeAuthorizationForToken", () => {
    it("builds the correct request", async () => {
      let expectedPayload = {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        state,
      };
      fetchMock.post(
        "https://api.dnsimple.com/v2/oauth/access_token",
        responseFromFixture("oauthAccessToken/success.http")
      );

      await dnsimple.oauth.exchangeAuthorizationForToken({
        code,
        clientId,
        clientSecret,
        redirectUri,
        state,
      });

      expect(fetchMock.callHistory.lastCall().options.body).toEqual(
        JSON.stringify(expectedPayload)
      );
    });

    it("returns the oauth token", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/oauth/access_token",
        responseFromFixture("oauthAccessToken/success.http")
      );

      const response = await dnsimple.oauth.exchangeAuthorizationForToken({
        code,
        clientId,
        clientSecret,
        redirectUri,
        state,
      });

      expect(response.access_token).toBe("zKQ7OLqF5N1gylcJweA9WodA000BUNJD");
      expect(response.token_type).toBe("Bearer");
      expect(response.account_id).toBe(1);
    });

    describe("when state and redirect_uri are provided", () => {
      const state = "super-state";
      const redirectUri = "super-redirect-uri";

      it("builds the correct request", async () => {
        let expectedPayload = {
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          state,
        };
        fetchMock.post(
          "https://api.dnsimple.com/v2/oauth/access_token",
          responseFromFixture("oauthAccessToken/success.http")
        );

        await dnsimple.oauth.exchangeAuthorizationForToken({
          code,
          clientId,
          clientSecret,
          state,
          redirectUri,
        });

        expect(fetchMock.callHistory.lastCall().options.body).toEqual(
          JSON.stringify(expectedPayload)
        );
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
