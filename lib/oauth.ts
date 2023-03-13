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
   * @param code The code returned from the authorize URL
   * @param clientId The OAuth application client ID
   * @param clientSecret The OAuth application client secret
   * @param options
   * @param options.state The random state used when authorizing
   * @param options.redirectUri A redirect URI
   */
  exchangeAuthorizationForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    {
      redirectUri,
      state,
    }: {
      state: string;
      redirectUri: string;
    }
  ) {
    const attributes = {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      state,
      redirect_uri: redirectUri,
    };

    return this._client.request("POST", "/oauth/access_token", attributes, {});
  }

  /**
   * Gets the URL to authorize a user for an application via the OAuth2 flow.
   *
   * @see https://developer.dnsimple.com/v2/oauth/
   *
   * @param clientId The client ID provided when the application was registered with DNSimple.
   * @param options At minimum the state option is required
   * @param options.state A random string to protect against CSRF
   * @param options.redirectUri The URL to redirect to after authorizing
   * @param options.scope The scope to request during authorization
   * @return The URL to redirect the user to for authorization
   */
  authorizeUrl(
    clientId: string,
    options: {
      state: string;
      redirectUri?: string;
      scope?: string;
    }
  ) {
    const siteUrl = this._client.baseUrl.replace("api.", "");
    return `${siteUrl}/oauth/authorize?${toQueryString({
      state: options.state,
      redirectUri: options.redirectUri,
      scope: options.scope,
      client_id: clientId,
      response_type: "code",
    })}`;
  }
}
