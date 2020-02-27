'use strict';

const url = require('url');
const Client = require('./dnsimple/client');
const services = {
  accounts: require('./dnsimple/accounts'),
  certificates: require('./dnsimple/certificates'),
  collaborators: require('./dnsimple/collaborators'),
  contacts: require('./dnsimple/contacts'),
  domains: require('./dnsimple/domains'),
  identity: require('./dnsimple/identity'),
  oauth: require('./dnsimple/oauth'),
  registrar: require('./dnsimple/registrar'),
  services: require('./dnsimple/services'),
  templates: require('./dnsimple/templates'),
  tlds: require('./dnsimple/tlds'),
  vanityNameServers: require('./dnsimple/vanity_name_servers'),
  webhooks: require('./dnsimple/webhooks'),
  zones: require('./dnsimple/zones'),
};

Dnsimple.VERSION = '3.0.3';
Dnsimple.DEFAULT_TIMEOUT = 120000;
Dnsimple.DEFAULT_BASE_URL = 'https://api.dnsimple.com';
Dnsimple.DEFAULT_USER_AGENT = 'dnsimple-node/' + Dnsimple.VERSION;
Dnsimple.services = services;

function Dnsimple(attrs) {
  if (!(this instanceof Dnsimple)) {
    return new Dnsimple(attrs);
  }

  this._api = {
    accessToken: null,
    baseUrl: null,
    userAgent: null,
  };

  this.VERSION = Dnsimple.VERSION;
  this.client = new Client(this);
  this._setupServices();
  this.setTimeout(attrs.timeout);
  this.setAccessToken(attrs.accessToken);
  this.setBaseUrl(attrs.baseUrl);
  this.setUserAgent(attrs.userAgent);
}

Dnsimple.prototype = {
  setTimeout: function(timeout) {
    this.timeout = timeout || Dnsimple.DEFAULT_TIMEOUT;
  },

  accessToken: function() {
    return this._api.accessToken;
  },

  setAccessToken: function(accessToken) {
    this._api.accessToken = accessToken;
  },

  baseUrl: function() {
    return this._api.baseUrl;
  },

  setBaseUrl: function(baseUrl) {
    this._api.baseUrl = url.parse(baseUrl || Dnsimple.DEFAULT_BASE_URL);
  },

  userAgent: function() {
    return this._api.userAgent;
  },

  setUserAgent: function(userAgent) {
    if (!userAgent) {
      this._api.userAgent = Dnsimple.DEFAULT_USER_AGENT;
    } else {
      this._api.userAgent = userAgent + ' ' + Dnsimple.DEFAULT_USER_AGENT;
    }
  },

  _setupServices: function() {
    for (var name in services) {
      this[name] = new services[name](this.client);
    }
  },
}

module.exports = Dnsimple;
