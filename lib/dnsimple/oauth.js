'use strict';

const querystring = require('querystring');

/**
 * Methods for working with OAuth token exchange.
 *
 * @see https://developer.dnsimple.com/v2/oauth
 */
class Oauth {
  constructor(client) {
    this._client = client;
  }

  /**
   * Exchange the short-lived authorization code for an access token
   * that is used to authenticate API calls.
   *
   * @see https://developer.dnsimple.com/v2/oauth
   * @param {string} The code returned from the authorize URL
   * @param {string} The OAuth application client ID
   * @param {string} The OAuth application client secret
   * @param {Object} options
   * @param {string} options.state The random state used when authorizing
   * @param {string} [options.redirectUri] A redirect URI
   * @return {Promise}
   */
  exchangeAuthorizationForToken(code, clientId, clientSecret, options = {}) {
    let attributes = {
      code: code,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
    }

    if (!(options.state === undefined)) {
      attributes.state = options.state;
      delete options.state;
    }

    if (!(options.redirectUri === undefined)) {
      attributes.redirect_uri = options.redirectUri;
      delete options.redirectUri;
    }

    return this._client.post('/oauth/access_token', attributes, options)
  }

  /**
   * Gets the URL to authorize a user for an application via the OAuth2 flow.
   *
   * @see https://developer.dnsimple.com/v2/oauth/
   *
   * @param {string} clientId The client ID provided when the application was registered with DNSimple.
   * @param {Object} options At minimum the state option is required
   * @param {string} options.state A random string to protect against CSRF
   * @param {string} [options.redirect_uri] The URL to redirect to after authorizing
   * @param {string} [options.scope] The scope to request during authorization
   * @return {string} The URL to redirect the user to for authorization
   */
  authorizeUrl(clientId, options = {}) {
    let siteUrl = this._client.baseUrl().href.replace('api.', '');
    let url = `${siteUrl}oauth/authorize`;

    options = Object.assign(options, {client_id: clientId, response_type: 'code'});
    url = `${url}?${querystring.stringify(options)}`;
    return url;
  }
}

module.exports = Oauth;
