/**
 * Async generator function to assist with paginated APIs.
 * Use this to iterate through individual items of a paginated API with ease.
 * Provide a callback that makes the request with the provided page number, and this function will take care of calling the API and yielding the individual items, allowing continuous iteration of all items across all pages like a single list.
 *
 * @example Iterate through all items of a paginated API:
 * ```
 * const client = new Dnsimple({});
 * const paginated = paginate(page => client.certificates.listCertificates(1000, "bingo.pizza", { sort: "name:asc", page }));
 * for await (const certificate of paginated) {
 *   console.log("Certificate", certificate.name, "expires at", certificate.expires_at);
 * }
 * ```
 *
 * @example Most paginated API methods also have a helper submethod that will invoke this function automatically with the appropriate arguments:
 * ```
 * const client = new Dnsimple({});
 * const paginated = client.certificates.listCertificates.paginate(1000, "bingo.pizza", { sort: "name:asc" });
 * for await (const certificate of paginated) {
 *   console.log("Certificate", certificate.name, "expires at", certificate.expires_at);
 * }
 * ```
 */
export default async function* paginate<Item>(
  fn: (page: number) => Promise<{
    data: ReadonlyArray<Item>;
    pagination: {
      total_pages: number;
    };
  }>
): AsyncGenerator<Item, any, any> {
  let page = 1;
  while (true) {
    const res = await fn(page);
    yield* res.data;
    if (page >= res.pagination.total_pages) {
      break;
    }
    page++;
  }
}
