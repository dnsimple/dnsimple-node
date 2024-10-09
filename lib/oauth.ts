import { DNSimple, toQueryString } from "./main";

/**
 * Methods for working with OAuth token exchange.
 *
 * @see https://developer.dnsimple.com/v2/oauth
 */
export class OAuth {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Exchange the short-lived authorization code for an access token
   * that is used to authenticate API calls.
   *
   * @see https://developer.dnsimple.com/v2/oauth
   * @param attributes
   * @param attributes.code The code returned from the authorize URL
   * @param attributes.clientId The OAuth application client ID
   * @param attributes.clientSecret The OAuth application client secret
   * @param attributes.state The random state used when authorizing
   * @param attributes.redirectUri A redirect URI
   */
  exchangeAuthorizationForToken(attributes: {
    code: string;
    clientId: string;
    clientSecret: string;
    state: string;
    redirectUri: string;
  }) {
    return this._client.request(
      "POST",
      "/oauth/access_token",
      {
        client_id: attributes.clientId,
        client_secret: attributes.clientSecret,
        code: attributes.code,
        grant_type: "authorization_code",
        redirect_uri: attributes.redirectUri,
        state: attributes.state,
      },
      {}
    );
  }

  /**
   * Gets the URL to authorize a user for an application via the OAuth2 flow.
   *
   * @see https://developer.dnsimple.com/v2/oauth/
   *
   * @param attributes At minimum the state option is required
   * @param attributes.clientId The client ID provided when the application was registered with DNSimple.
   * @param attributes.state A random string to protect against CSRF
   * @param attributes.redirectUri The URL to redirect to after authorizing
   * @param attributes.scope The scope to request during authorization
   * @return The URL to redirect the user to for authorization
   */
  authorizeUrl(attributes: { clientId: string; state: string; redirectUri?: string; scope?: string }) {
    const siteUrl = this._client.baseUrl.replace("api.", "");
    return `${siteUrl}/oauth/authorize?${toQueryString({
      state: attributes.state,
      redirect_uri: attributes.redirectUri,
      scope: attributes.scope,
      client_id: attributes.clientId,
      response_type: "code",
    })}`;
  }
}
