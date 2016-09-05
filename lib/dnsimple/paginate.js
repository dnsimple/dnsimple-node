'use strict';

class Paginate {
  constructor(invoker) {
    this._invoker = invoker;
  }

  paginate(listFunction, args) {
    var self = this;
    return new Promise(function(resolve, reject) {
      self._nextPage(self._invoker, listFunction, args).then(function(responses) {
        let items = [].concat.apply([], responses.map(function(response) { return response.data; }));
        resolve(items);
      });
    });
  }

  /**
   * Get the next page in pagination results by calling the function `f`
   * with the arguments `args` starting at the given page (defaults to
   * page 1).
   *
   * @return {Promise}
   */
  _nextPage(invoker, f, args, page = 1) {
    var self = this;
    return new Promise(function(resolve, reject) {
      // Set the page option to the page argument value
      Object.assign(args[args.length - 1], {page: page});

      // Apply the list function on the invoker with the given args
      f.apply(invoker, args).then(function(response) {
        if (page < response.pagination.total_pages) {
          return new Promise(function(resolve, reject) {
            // Recursively call _nextPage while incrementing the page number
            self._nextPage(invoker, f, args, page + 1).then(function(nextResponse) {
              resolve(nextResponse);
            });
          }).then(function(responses) {
            resolve([response].concat(responses));
          });
        }
        // No more pages left
        resolve.call(invoker, [response]);
      });
    });
  }
}

module.exports = Paginate;
