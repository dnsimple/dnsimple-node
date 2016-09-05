'use strict';

/**
 * Class to handle pagination.
 *
 * It must be constructed by passing the invoker instance (i.e. the service that has the
 * list function in its methods).
 */
class Paginate {
  constructor(invoker) {
    this._invoker = invoker;
  }

  /**
   * Paginate through all resources using the given `listFunction`.
   *
   * Note that this method assumes that the `options` Object is the last item in the `args`
   * Array (which is the standard practice throughout this library).
   *
   * @param {Function} listFunction The list function that will be called to retrieve each page
   * @param {Array} args Array of arguments to pass to the list function.
   * @return {Promise} A Promise that resolves to the full Array of items
   */
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
