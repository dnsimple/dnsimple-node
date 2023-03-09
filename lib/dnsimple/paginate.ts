/**
 * Class to handle pagination.
 *
 * It must be constructed by passing the invoker instance (i.e. the service that has the
 * list function in its methods).
 */
class Paginate<Invoker> {
  constructor (private readonly _invoker: Invoker) {}

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
  async paginate<Item, Method extends (this: Invoker, ...args: any[]) => Promise<{
    pagination: {
      total_pages: number,
    },
    data: Item[],
  }>> (listFunction: Method, args: Parameters<Method>) {
    const optionsWithPage = { ...args.at(-1)!, page: 1 };
    const argsWithPage = [...args.slice(0, -1), optionsWithPage];
    const items = Array<Item>();
    while (true) {
      const response = await listFunction.apply(this._invoker, argsWithPage as any);
      items.push(...response.data);
      if (optionsWithPage.page >= response.pagination.total_pages) {
        break;
      }
      optionsWithPage.page++;
    }
    return items;
  }
}

export = Paginate;
