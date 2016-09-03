'use strict';

const url = require('url');
const Client = require('./dnsimple/client');
const services = {
  oauth: require('./dnsimple/oauth'),
  identity: require('./dnsimple/identity'),
  accounts: require('./dnsimple/accounts'),
  contacts: require('./dnsimple/contacts'),
  domains: require('./dnsimple/domains'),
  tlds: require('./dnsimple/tlds'),
  registrar: require('./dnsimple/registrar'),
  services: require('./dnsimple/services'),
  zones: require('./dnsimple/zones'),
};

Dnsimple.services = services;
Dnsimple.DEFAULT_TIMEOUT = require('http').createServer().timeout;
Dnsimple.DEFAULT_BASE_URL = 'https://api.dnsimple.com';
Dnsimple.DEFAULT_USER_AGENT = 'dnsimple-node/v2';

function Dnsimple(attrs) {
  if (!(this instanceof Dnsimple)) {
    return new Dnsimple(attrs);
  }

  this._api = {
    accessToken: null,
    baseUrl: null,
    userAgent: null,
  };

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
    this._api.userAgent = userAgent || Dnsimple.DEFAULT_USER_AGENT;
  },

  _setupServices: function() {
    for (var name in services) {
      this[name] = new services[name](this.client);
    }
  },
}

module.exports = Dnsimple;
