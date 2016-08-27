function Dnsimple(accessToken) {
  if (!(this instanceof Dnsimple)) {
    return new Dnsimple(accessToken);
  }

  this._api = {
    accessToken: null,
  };

  this.setAccessToken(accessToken)
}

Dnsimple.prototype = {
  setAccessToken: function(accessToken) {
    this._setApiField('accessToken', accessToken);
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },
}

module.exports = Dnsimple;
