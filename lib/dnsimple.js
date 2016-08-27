var services = {
  identity: require('./dnsimple/identity'),
  domains: require('./dnsimple/domains'),
}
Dnsimple.services = services;

function Dnsimple(accessToken) {
  if (!(this instanceof Dnsimple)) {
    return new Dnsimple(accessToken);
  }

  this._api = {
    accessToken: null,
  };

  this._setupServices();
  this.setAccessToken(accessToken)
}

Dnsimple.prototype = {
  setAccessToken: function(accessToken) {
    this._setApiField('accessToken', accessToken);
  },

  _setupServices: function() {
    for (var name in services) {
      this[name] = new services[name](this);
    }
  },

  _setApiField: function(key, value) {
    this._api[key] = value;
  },
}

module.exports = Dnsimple;
