'use strict';

class Paginate {
  constructor(invoker) {
    this._invoker = invoker;
  }

  paginate(listFunction, args) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self._invoker._client._nextPage(self._invoker, listFunction, args).then(function(responses) {
        let items = [].concat.apply([], responses.map(function(response) { return response.data; }));
        resolve(items);
      });
    });
  }
}

module.exports = Paginate;
