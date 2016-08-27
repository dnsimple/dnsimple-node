'use strict';

function Identity(dnsimple) {
  if (!(this instanceof Identity)) {
    return new Identity();
  }
}

Identity.prototype = {
  whoami: function() {
    return {};
  },
}

module.exports = Identity;
