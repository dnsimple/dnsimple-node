'use strinct';

require('mocha');
require('chai').use(require('chai-as-promised'));

var utils = module.exports = {

  getAccessToken: function() {
    var key = process.env.TOKEN || 'bogus';
    return key
  },

}
