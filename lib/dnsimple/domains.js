'use strict';

function Domains(dnsimple) {
  if (!(this instanceof Domains)) {
    return new Domains();
  }
}

Domains.prototype = {
  listDomains: function(accountId) {
    return [];
  },
}

module.exports = Domains;
