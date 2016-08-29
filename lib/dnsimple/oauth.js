'use strict';

const querystring = require('querystring');

class Oauth {
  constructor(client) {
    this._client = client;
  }

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

  authorizeUrl(clientId, options = {}) {
    let siteUrl = this._client.baseUrl().href.replace('api.', '');
    let url = siteUrl + 'oauth/authorize';

    options = Object.assign(options, {client_id: clientId, response_type: 'code'});
    url = url + '?' + querystring.stringify(options);
    return url;
  }
}

module.exports = Oauth;
